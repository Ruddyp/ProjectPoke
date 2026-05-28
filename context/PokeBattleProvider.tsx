"use client";
import {
  PokeBattleGameStatus,
  PokeBattleObject,
  PokeBattleObjectType,
  PokeBattlePokemonDetails,
  PokeBattlePokemonMove,
  PokeBattlePokemonStats,
  PokeBattleSound,
  PokeBattleTrainer,
  Types,
} from "@/app/type";
import {
  getPokemonTeam,
  getRandomNumber,
  POKEBATTLE_OBJECTS,
  RECHARGE_MOVES,
  sleep,
  statToFrench,
} from "@/lib/utils";
import { IPokeBatlle } from "@/models/pokebattle_leaderboard";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type PokeBattleContextType = {
  gameStatus: PokeBattleGameStatus;
  userPokemons: PokeBattlePokemonDetails[];
  enemyPokemons: PokeBattlePokemonDetails[];
  userObjects: PokeBattleObject[];
  enemyObjects: PokeBattleObject[];
  isActionPending: boolean;
  isFetching: boolean;
  isAttacking: boolean;
  leaderboard: IPokeBatlle[];
  sound: { type: PokeBattleSound; trigger: number } | null;
  types: Types[];
  startGame: (trainer?: PokeBattleTrainer) => void;
  startBattle: () => void;
  trainer: PokeBattleTrainer | null;
  goToWaitingScreen: () => void;
  addToLeaderboard: (score: IPokeBatlle) => void;
  updateLeaderboard: (idToUpdate: string, score: IPokeBatlle) => void;
  handleUserAttack: (move: PokeBattlePokemonMove) => Promise<void>;
  handlePokemonReplacement: (id: number, team: "user" | "enemy") => void;
  handleObjectUse: (
    type: PokeBattleObjectType,
    team: "user" | "enemy",
    id: number,
  ) => void;
  textBox: string;
  setTextBox: Dispatch<SetStateAction<string>>;
};

export const PokeBattleContext = createContext<
  PokeBattleContextType | undefined
>(undefined);

export function PokeBattleProvider({
  children,
  types,
  pokeBattleLeaderboard,
}: {
  children: ReactNode;
  types: any;
  pokeBattleLeaderboard: IPokeBatlle[];
}) {
  const [gameStatus, setGameStatus] = useState<PokeBattleGameStatus>("waiting");
  const [targetTeam, setTargetTeam] = useState<"user" | "enemy">("user");
  const [leaderboard, setLeaderboard] = useState(pokeBattleLeaderboard);
  const [trainer, setTrainer] = useState<null | PokeBattleTrainer>(null);
  const [userPokemons, setUserPokemons] = useState<PokeBattlePokemonDetails[]>(
    [],
  );
  const [enemyPokemons, setEnemyPokemons] = useState<
    PokeBattlePokemonDetails[]
  >([]);
  const [enemyObjects, setEnemyObjects] =
    useState<PokeBattleObject[]>(POKEBATTLE_OBJECTS);
  const [userObjects, setUserObjects] =
    useState<PokeBattleObject[]>(POKEBATTLE_OBJECTS);
  const [textBox, setTextBox] = useState("");
  const [isActionPending, setIsActionPending] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [sound, setSound] = useState<{
    type: PokeBattleSound;
    trigger: number;
  } | null>(null);

  const getActivePokemon = (pokemons: PokeBattlePokemonDetails[]) => {
    return (
      pokemons.find((poke) => poke.isActive && poke.stats.hp > 0) ??
      pokemons.find((p) => p.stats.hp > 0) ??
      pokemons[0]
    );
  };

  const getPokemon = (pokemons: PokeBattlePokemonDetails[], id: number) => {
    return pokemons.find((poke) => poke.id && id);
  };

  // TOUR DE L'ENNEMI
  useEffect(() => {
    if (gameStatus !== "enemy_turn") return;
    handleEnemyTurn();
  }, [gameStatus]);

  // Gestion de l'intermission (Vérification des KO)
  useEffect(() => {
    if (gameStatus !== "intermission") return;

    async function runIntermissionPhase() {
      // On définit l'ordre de passage selon l'équipe ciblée
      const teamOrder =
        targetTeam === "enemy"
          ? [
              { isEnemy: true, team: enemyPokemons, set: setEnemyPokemons },
              { isEnemy: false, team: userPokemons, set: setUserPokemons },
            ]
          : [
              { isEnemy: false, team: userPokemons, set: setUserPokemons },
              { isEnemy: true, team: enemyPokemons, set: setEnemyPokemons },
            ];

      for (const element of teamOrder) {
        const result = await checkTeamKO(
          element.isEnemy,
          element.team,
          element.set,
        );

        if (result === "ended") {
          setGameStatus("ending");
          return;
        }
      }

      // Si aucun mort, on passe au tour suivant
      const nextTurnStatus =
        targetTeam === "enemy" ? "enemy_turn" : "user_turn";
      setGameStatus(nextTurnStatus);

      const activeUser = getActivePokemon(userPokemons);
      if (nextTurnStatus === "user_turn" && activeUser.currentHp > 0) {
        setTextBox(`Que doit faire ${activeUser.name} ?`);
      }
    }

    runIntermissionPhase();
  }, [gameStatus, targetTeam]);

  // Gestion des KO
  async function checkTeamKO(
    isEnemy: boolean,
    team: PokeBattlePokemonDetails[],
    setPokemons: Dispatch<SetStateAction<PokeBattlePokemonDetails[]>>,
  ) {
    const activePokemon = getActivePokemon(team);
    const otherPokemonAlive = team.filter(
      (p) => !p.isActive && p.currentHp > 0,
    );
    const isTeamDead =
      activePokemon.currentHp <= 0 && otherPokemonAlive.length === 0;

    // Cas ou Tout le monde est KO -> Fin de partie
    if (isTeamDead) {
      setTextBox(
        isEnemy
          ? "Tous les Pokémon de l'équipe adverse sont K.O !"
          : "Tous vos Pokémon sont K.O !",
      );
      await sleep(2000);
      return "ended";
    }

    // Cas ou le Pokémon actif est KO mais il reste des remplaçants
    if (activePokemon.currentHp <= 0) {
      const nextPokemon = otherPokemonAlive[0];

      setTextBox(
        `${activePokemon.name} est K.O ! ${nextPokemon.name} entre sur le terrain !`,
      );
      setSound({ type: "KO", trigger: Date.now() });
      await sleep(2000);
      setPokemons((prev) => {
        return prev.map((p) => {
          if (p.id === activePokemon.id)
            return {
              ...p,
              isActive: false,
              isParalyze: false,
              isAsleep: false,
              isFrozen: false,
              isBurnt: false,
              isPoisoned: false,
              isSeeded: false,
            };
          if (p.id === nextPokemon.id) return { ...p, isActive: true };
          return p;
        });
      });
      setTextBox(`Que doit faire ${nextPokemon.name} ?`);
      return "replaced";
    }

    return "ok";
  }

  async function handleObjectUse(
    objectType: PokeBattleObjectType,
    team: "user" | "enemy",
    id: number,
  ) {
    setIsActionPending(true);
    const pokemon = (
      team === "user"
        ? getPokemon(userPokemons, id)
        : getPokemon(enemyPokemons, id)
    ) as PokeBattlePokemonDetails;

    const updateTeam = team === "user" ? setUserPokemons : setEnemyPokemons;
    switch (objectType) {
      case "heal":
        updateTeam((prev) => {
          return prev.map((p) => {
            if (p.id === id) {
              const healAmount = p.stats.hp / 2;
              const newHp = Math.round(
                Math.min(p.currentHp + healAmount, p.stats.hp),
              );
              return {
                ...p,
                currentHp: newHp,
              };
            }
            return p;
          });
        });
        setTextBox(`${pokemon.name}, a repris des forces !`);
        setSound({ type: "leech-seed", trigger: Date.now() });
        await sleep(1500);
        break;
      case "reborn":
        updateTeam((prev) => {
          return prev.map((p) => {
            if (p.id === id) {
              const healAmount = p.stats.hp / 2;
              const newHp = Math.round(
                Math.min(p.currentHp + healAmount, p.stats.hp),
              );
              return {
                ...p,
                currentHp: newHp,
              };
            }
            return p;
          });
        });
        setTextBox(`${pokemon.name}, a retrouvé la forme !`);
        setSound({ type: "leech-seed", trigger: Date.now() });
        await sleep(1500);
        break;
      case "status":
        updateTeam((prev) => {
          return prev.map((p) => {
            if (p.id === id) {
              return {
                ...p,
                isParalyze: false,
                isAsleep: false,
                isFrozen: false,
                isBurnt: false,
                isPoisoned: false,
                isSeeded: false,
              };
            }
            return p;
          });
        });
        setTextBox(`${pokemon.name}, a été soigné de ses status !`);
        setSound({ type: "leech-seed", trigger: Date.now() });
        await sleep(1500);
        break;
    }

    // Mise à jour de la quantité d'objet
    const updateObject = team === "user" ? setUserObjects : setEnemyObjects;
    updateObject((prev) => {
      return prev.map((obj) => {
        if (obj.type === objectType) {
          return {
            ...obj,
            quantity: Math.max(0, obj.quantity - 1),
          };
        }
        return obj;
      });
    });

    setGameStatus("intermission");
    setTargetTeam(team === "user" ? "enemy" : "user");
    setIsActionPending(false);
  }

  async function handlePokemonReplacement(id: number, team: "user" | "enemy") {
    setIsActionPending(true);
    const activePokemon =
      team === "user"
        ? getActivePokemon(userPokemons)
        : getActivePokemon(enemyPokemons);

    const pokemon = (
      team === "user"
        ? getPokemon(userPokemons, id)
        : getPokemon(enemyPokemons, id)
    ) as PokeBattlePokemonDetails;

    setTextBox(`${activePokemon.name}, reviens !`);
    await sleep(1500);
    const updateTeam = team === "user" ? setUserPokemons : setEnemyPokemons;
    updateTeam((prev) => {
      return prev.map((p) => {
        // On remplace le isActive avec le pokemon voulu
        if (p.id === id) {
          setTextBox(`${p.name}, en avant !`);
          return {
            ...p,
            isActive: true,
          };
        }
        // On place le pokemon actif en inactif
        if (p.id === activePokemon.id) {
          return {
            ...p,
            isActive: false,
            isRecharging: false,
          };
        }
        return p;
      });
    });
    await sleep(1500);

    setGameStatus("intermission");
    setTargetTeam(team === "user" ? "enemy" : "user");
    setIsActionPending(false);
  }

  function hasTwoOrMoreStatus(pokemon: PokeBattlePokemonDetails) {
    const statusEffects: (keyof PokeBattlePokemonDetails)[] = [
      "isParalyze",
      "isAsleep",
      "isFrozen",
      "isBurnt",
      "isPoisoned",
      "isSeeded",
    ];

    const activeStatusCount = statusEffects.filter(
      (status) => pokemon[status] === true,
    ).length;

    return activeStatusCount >= 2;
  }

  async function handleEnemyChoice() {
    const activeEnemy = getActivePokemon(enemyPokemons);
    const activeUser = getActivePokemon(userPokemons);
    const isEnemyPokemonLifeUnder33Percent =
      activeEnemy.currentHp <= activeEnemy.stats.hp / 3;
    const isUserPokemonLifeUnder33Percent =
      activeUser.currentHp <= activeUser.stats.hp / 3;

    const enenyPokemonDead = enemyPokemons.filter((p) => p.currentHp <= 0);
    const shouldUseAntidote = hasTwoOrMoreStatus(activeEnemy);
    const canUseAntidote = enemyObjects.some(
      (obj) => obj.type === "status" && obj.quantity > 0,
    );
    const canUsePotion = enemyObjects.some(
      (obj) => obj.type === "heal" && obj.quantity > 0,
    );
    const canUseReborn = enemyObjects.some(
      (obj) => obj.type === "reborn" && obj.quantity > 0,
    );

    if (
      !isEnemyPokemonLifeUnder33Percent &&
      shouldUseAntidote &&
      canUseAntidote
    ) {
      setTextBox(
        `${trainer?.name ?? "L'adversaire"} utilise une antidote sur ${activeEnemy.name} !`,
      );
      await sleep(1500);
      await handleObjectUse("status", "enemy", activeEnemy.id);
      return false;
    }

    if (
      isEnemyPokemonLifeUnder33Percent &&
      !isUserPokemonLifeUnder33Percent &&
      Math.random() < 1 / 3 &&
      canUsePotion
    ) {
      setTextBox(
        `${trainer?.name ?? "L'adversaire"} utilise une potion sur ${activeEnemy.name} !`,
      );
      await sleep(1500);
      await handleObjectUse("heal", "enemy", activeEnemy.id);
      return false;
    }

    if (enenyPokemonDead.length >= 3 && canUseReborn && Math.random() < 1 / 2) {
      // Récupérer tous les Pokémon K.O.
      const deadPokemons = enemyPokemons.filter((p) => p.currentHp <= 0);

      // Choisir un index au hasard parmi ces Pokémon
      const randomIndex = Math.floor(Math.random() * deadPokemons.length);
      const pokemonToReborn = deadPokemons[randomIndex];

      setTextBox(
        `${trainer?.name ?? "L'adversaire"} utilise un rappel sur ${pokemonToReborn.name} !`,
      );
      await sleep(1500);
      await handleObjectUse("reborn", "enemy", pokemonToReborn.id);
      return false;
    }

    return true;
  }

  // Tour Ennemie
  async function handleEnemyTurn() {
    const activeEnemy = getActivePokemon(enemyPokemons);
    const activeUser = getActivePokemon(userPokemons);

    const isUserPokemonLifeUnder25Percent =
      activeUser.currentHp <= activeUser.stats.hp / 4;
    const shouldUsePhysical =
      activeEnemy.stats.attack >= activeEnemy.stats["special-attack"];

    setTextBox(`Au tour de ${activeEnemy.name} de jouer !`);
    await sleep(2000);

    try {
      const shouldAttack = await handleEnemyChoice();
      if (!shouldAttack) return;

      const effectiveMoves = activeEnemy.moves.filter(
        (m) => m.type !== "normal",
      );

      let move;

      if (activeUser.types.includes("spectre") && effectiveMoves.length > 0) {
        // Si c'est un Spectre, on a 70% de chances de choisir une attaque efficace
        // et 30% de chances de choisir totalement au hasard parmi toutes les attaques
        const shouldPlaySmart = Math.random() < 0.5;

        if (shouldPlaySmart) {
          move = effectiveMoves[getRandomNumber(0, effectiveMoves.length - 1)];
        } else {
          move =
            activeEnemy.moves[getRandomNumber(0, activeEnemy.moves.length - 1)];
        }
      } else {
        // Sinon, comportement normal
        move =
          activeEnemy.moves[getRandomNumber(0, activeEnemy.moves.length - 1)];
      }
      if (isUserPokemonLifeUnder25Percent) {
        const moveCategory = shouldUsePhysical ? "physical" : "special";
        move =
          activeEnemy.moves.find((m) => m.category === moveCategory) ?? move;
      }

      if (await canPokemonAttack(activeEnemy, move, "enemy")) {
        await attackResolution(activeEnemy, activeUser, move, "enemy");
      }

      if (activeEnemy.isBurnt) {
        await applyBurnDamage(activeEnemy, "enemy");
      }
      if (activeEnemy.isPoisoned) {
        await applyPoisonDamage(activeEnemy, "enemy");
      }
      if (activeEnemy.isSeeded) {
        await applyLeechSeed(activeEnemy, activeUser, "enemy");
      }
    } finally {
      setGameStatus("intermission");
      setTargetTeam("user");
    }
  }

  // TOUR DU JOUEUR
  async function handleUserAttack(move: PokeBattlePokemonMove) {
    if (isActionPending || gameStatus !== "user_turn") return;
    const activeUser = getActivePokemon(userPokemons);
    const activeEnemy = getActivePokemon(enemyPokemons);

    try {
      if (await isRecharging(activeUser, "user")) return;

      setIsActionPending(true);

      if (await canPokemonAttack(activeUser, move, "user")) {
        await attackResolution(activeUser, activeEnemy, move, "user");
      }

      if (activeUser.isBurnt) await applyBurnDamage(activeUser, "user");
      if (activeUser.isPoisoned) await applyPoisonDamage(activeUser, "user");
      if (activeUser.isSeeded)
        await applyLeechSeed(activeUser, activeEnemy, "user");
    } finally {
      setGameStatus("intermission");
      setTargetTeam("enemy");
      setIsActionPending(false);
    }
  }

  async function applyBurnDamage(
    attacker: PokeBattlePokemonDetails,
    attackerTeam: "user" | "enemy",
  ) {
    const updateTeam =
      attackerTeam === "user" ? setUserPokemons : setEnemyPokemons;

    const burnDamage = Math.max(1, Math.floor(attacker.stats.hp / 8));
    updateTeam((prev) => {
      return prev.map((poke) => {
        if (poke.id === attacker.id && poke.currentHp > 0) {
          setTextBox(`${attacker.name} souffre de sa brûlure !`);
          setSound({ type: "burn", trigger: Date.now() });
          return {
            ...poke,
            currentHp: Math.max(0, poke.currentHp - burnDamage),
          };
        }
        return poke;
      });
    });
    await sleep(1500);
  }

  async function applyPoisonDamage(
    attacker: PokeBattlePokemonDetails,
    attackerTeam: "user" | "enemy",
  ) {
    const updateTeam =
      attackerTeam === "user" ? setUserPokemons : setEnemyPokemons;

    const poisonDamage = Math.max(1, Math.floor(attacker.stats.hp / 8));
    updateTeam((prev) => {
      return prev.map((poke) => {
        if (poke.id === attacker.id && poke.currentHp > 0) {
          setTextBox(`${attacker.name} souffre du poison !`);
          setSound({ type: "poison-status", trigger: Date.now() });
          return {
            ...poke,
            currentHp: Math.max(0, poke.currentHp - poisonDamage),
          };
        }
        return poke;
      });
    });
    await sleep(1500);
  }

  async function applyConfusionDamage(
    attacker: PokeBattlePokemonDetails,
    attackerTeam: "user" | "enemy",
  ) {
    const confusionBaseDamage =
      (22 * 40 * attacker.stats.attack) / attacker.stats.defense / 50 + 2;
    const confusionFinalDamage = Math.floor(confusionBaseDamage);

    const attackerRemainingHp = Math.max(
      0,
      attacker.currentHp - confusionFinalDamage,
    );
    setTextBox(`${attacker.name} se blesse dans sa confusion !`);
    setSound({ type: "normal", trigger: Date.now() });
    await sleep(1500);
    const updateTeam =
      attackerTeam === "user" ? setUserPokemons : setEnemyPokemons;
    updateTeam((prev) => {
      return prev.map((poke) => {
        if (poke.id === attacker.id) {
          return {
            ...poke,
            currentHp: attackerRemainingHp,
          };
        }
        return poke;
      });
    });
  }

  async function applyLeechSeed(
    attacker: PokeBattlePokemonDetails,
    defender: PokeBattlePokemonDetails,
    attackerTeam: "user" | "enemy",
  ) {
    // La victime est le Pokémon qui vient de jouer, le bénéficiaire est son adversaire
    const setVictimTeam =
      attackerTeam === "user" ? setUserPokemons : setEnemyPokemons;
    const setBeneficiaryTeam =
      attackerTeam === "user" ? setEnemyPokemons : setUserPokemons;

    // Calcul du siphonnage (1/8 des PV Max de la victime)
    const damageValue = Math.floor(attacker.stats.hp / 8);

    let victimIsDead = false;
    // Appliquer les dégâts à la victime qui vient de finir son tour
    setVictimTeam((prev) => {
      return prev.map((p) => {
        if (p.id === attacker.id && p.currentHp > 0) {
          setTextBox(`Les sangsues vident ${attacker.name} !`);
          setSound({ type: "leech-seed-dgt", trigger: Date.now() });
          if (Math.max(0, p.currentHp - damageValue) === 0) {
            victimIsDead = true;
          }
          return {
            ...p,
            currentHp: Math.max(0, p.currentHp - damageValue),
          };
        }
        return p;
      });
    });
    await sleep(1200);

    // Appliquer le soin à l'adversaire (seulement s'il est encore en vie)
    if (defender.currentHp > 0) {
      setBeneficiaryTeam((prev) =>
        prev.map((p) => {
          if (
            p.id === defender.id &&
            p.currentHp < p.stats.hp &&
            p.currentHp > 0 &&
            !victimIsDead
          ) {
            setTextBox(
              `Les sangsues apportent de l'énergie à ${defender.name} !`,
            );
            setSound({ type: "leech-seed", trigger: Date.now() });
            return {
              ...p,
              currentHp: Math.min(p.stats.hp, p.currentHp + damageValue),
            };
          }
          return p;
        }),
      );
      await sleep(1500);
    }
  }

  async function canPokemonAttack(
    attacker: PokeBattlePokemonDetails,
    move: PokeBattlePokemonMove,
    attackerTeam: "user" | "enemy",
  ): Promise<boolean> {
    if (await isFlinch(attacker, attackerTeam)) return false;
    if (await isSleeping(attacker, attackerTeam)) return false;
    if (await isFrozen(attacker, move, attackerTeam)) return false;
    await isConfused(attacker, attackerTeam); // On retire 1 au turn de confusion (seulement si le pokemon ne dort pas et pas gelé)

    return true;
  }

  async function isRecharging(
    attacker: PokeBattlePokemonDetails,
    attackerTeam: "user" | "enemy",
  ) {
    if (attacker.isRecharging) {
      const updateTeam =
        attackerTeam === "user" ? setUserPokemons : setEnemyPokemons;
      updateTeam((prev) =>
        prev.map((poke) =>
          poke.id === attacker.id ? { ...poke, isRecharging: false } : poke,
        ),
      );
      setTextBox(`${attacker.name} se repose.`);
      await sleep(1500);
      return true;
    }
    return false;
  }

  async function isFlinch(
    attacker: PokeBattlePokemonDetails,
    attackerTeam: "user" | "enemy",
  ) {
    if (attacker.isFlinch) {
      const updateTeam =
        attackerTeam === "user" ? setUserPokemons : setEnemyPokemons;
      updateTeam((prev) =>
        prev.map((poke) =>
          poke.id === attacker.id ? { ...poke, isFlinch: false } : poke,
        ),
      );

      setTextBox(`${attacker.name} a la frousse et ne peut pas attaquer !`);
      await sleep(1500);
      return true;
    }
    return false;
  }

  async function isSleeping(
    attacker: PokeBattlePokemonDetails,
    attackerTeam: "user" | "enemy",
  ) {
    if (!attacker.isAsleep) return false;

    const updateTeam =
      attackerTeam === "user" ? setUserPokemons : setEnemyPokemons;

    if (attacker.sleepTurns > 0) {
      updateTeam((prev) =>
        prev.map((poke) =>
          poke.id === attacker.id
            ? { ...poke, sleepTurns: poke.sleepTurns - 1 }
            : poke,
        ),
      );
      setTextBox(`${attacker.name} dort profondément...`);
      setSound({ type: "sleep", trigger: Date.now() });

      await sleep(1500);
      return true;
    }

    updateTeam((prev) =>
      prev.map((poke) =>
        poke.id === attacker.id
          ? { ...poke, isAsleep: false, sleepTurns: 0 }
          : poke,
      ),
    );
    setTextBox(`${attacker.name} se réveille !`);
    await sleep(1500);
    return false;
  }

  async function isConfused(
    attacker: PokeBattlePokemonDetails,
    attackerTeam: "user" | "enemy",
  ) {
    if (!attacker.isConfused) return;

    const updateTeam =
      attackerTeam === "user" ? setUserPokemons : setEnemyPokemons;

    // Le pokemon est confus MAJ du compteur confusion
    if (attacker.confusionTurns > 0) {
      updateTeam((prev) =>
        prev.map((poke) =>
          poke.id === attacker.id
            ? { ...poke, confusionTurns: poke.confusionTurns - 1 }
            : poke,
        ),
      );
      setTextBox(`${attacker.name} est confus !`);
      setSound({ type: "confusion", trigger: Date.now() });
      await sleep(1500);
      return;
    }

    if (attacker.confusionTurns === 0) {
      updateTeam((prev) =>
        prev.map((poke) =>
          poke.id === attacker.id
            ? { ...poke, confusionTurns: 0, isConfused: false }
            : poke,
        ),
      );
      setTextBox(`${attacker.name} n'est plus confus !`);
      await sleep(1500);
      return;
    }
  }

  async function isParalyze(attacker: PokeBattlePokemonDetails) {
    if (attacker.isParalyze && Math.random() * 100 <= 25) {
      setTextBox(
        `${attacker.name} est totalement paralysé ! Il ne peut pas attaquer !`,
      );
      setSound({ type: "paralysis", trigger: Date.now() });
      await sleep(1500);
      return true;
    }
    return false;
  }

  async function isFrozen(
    attacker: PokeBattlePokemonDetails,
    move: PokeBattlePokemonMove,
    attackerTeam: "user" | "enemy",
  ) {
    if (!attacker.isFrozen) return false;
    const iceMelts = Math.random() * 100 <= 20;
    const isFireAttack = move.type === "feu";

    if (iceMelts || isFireAttack) {
      const updateAttackerTeam =
        attackerTeam === "user" ? setUserPokemons : setEnemyPokemons;

      updateAttackerTeam((prev) =>
        prev.map((p) => (p.id === attacker.id ? { ...p, isFrozen: false } : p)),
      );

      setTextBox(`${attacker.name} a dégelé !`);
      await sleep(1500);
      return false;
    }

    setTextBox(`${attacker.name} est gelé ! Il ne peut pas attaquer !`);
    setSound({ type: "freeze", trigger: Date.now() });
    await sleep(1500);
    return true;
  }

  async function attackResolution(
    attacker: PokeBattlePokemonDetails,
    defender: PokeBattlePokemonDetails,
    move: PokeBattlePokemonMove,
    attackerTeam: "user" | "enemy",
  ) {
    setTextBox(`${attacker.name} utilise ${move.name} !`);
    move.category !== "status"
      ? setSound({ type: move.type, trigger: Date.now() })
      : setSound({ type: "status", trigger: Date.now() });
    await sleep(1500);

    // On vérifie avant d'attaquer si le joueur prend les damage de confusion
    // Ensuite on vérifie si le joueur n'est pas paralyser
    // De plus on regarde si l'attaque n'échoue pas
    // Finalement le pokemon peut attaquer
    if (attacker.isConfused && Math.random() < 1 / 3) {
      await applyConfusionDamage(attacker, attackerTeam);
      return;
    }

    if (attacker.isParalyze && (await isParalyze(attacker)) === true) return;

    if (move.category === "status") {
      await applyStatus(attacker, defender, move, attackerTeam);
      return;
    }

    await applyDamage(attacker, defender, move, attackerTeam);
  }

  async function applyStatus(
    attacker: PokeBattlePokemonDetails,
    defender: PokeBattlePokemonDetails,
    move: PokeBattlePokemonMove,
    attackerTeam: "user" | "enemy",
  ) {
    const isAttackSuccess = await attackSuccess(attacker, defender, move);
    if (!isAttackSuccess) return;

    if (
      move.healing !== undefined &&
      move.healing > 0 &&
      attacker.currentHp >= attacker.stats.hp
    ) {
      setTextBox(`Les PV de ${attacker.name} sont au maximum !`);
      await sleep(1500);
      return;
    }

    if (move.status === "paralysis" && defender.isParalyze) {
      setTextBox(`${defender.name} est déjà paralysé !`);
      await sleep(1500);
      return;
    }

    if (move.status === "sleep" && defender.isAsleep) {
      setTextBox(`${defender.name} dort déjà !`);
      await sleep(1500);
      return;
    }

    if (move.status === "burn" && defender.isBurnt) {
      setTextBox(`${defender.name} est déjà brûlé !`);
      await sleep(1500);
      return;
    }

    if (move.status === "freeze" && defender.isFrozen) {
      setTextBox(`${defender.name} est déjà gelé !`);
      await sleep(1500);
      return;
    }

    if (move.status === "poison" && defender.isPoisoned) {
      setTextBox(`${defender.name} souffre déjà du poison !`);
      await sleep(1500);
      return;
    }

    if (move.status === "confusion" && defender.isConfused) {
      setTextBox(`${defender.name} est déjà confus !`);
      await sleep(1500);
      return;
    }

    if (move.status === "leech-seed" && defender.isSeeded) {
      setTextBox(`${defender.name} est déjà infecté !`);
      await sleep(1500);
      return;
    }

    await applyBuff(attacker, defender, move, attackerTeam);
    await sleep(150);

    const statusChance = move.statusChance === 0 ? 100 : move.statusChance;
    const applyStatus = Math.random() * 100 <= statusChance;

    if (!applyStatus) {
      setTextBox(`Mais cela échoue !`);
      await sleep(1500);
      return;
    }

    const updateTeam =
      attackerTeam === "user" ? setEnemyPokemons : setUserPokemons;

    switch (move.status) {
      case "paralysis":
        updateTeam((prev) =>
          prev.map((poke) =>
            poke.id === defender.id ? { ...poke, isParalyze: true } : poke,
          ),
        );
        setTextBox(`${defender.name} est maintenant paralysé !`);
        setSound({ type: "paralysis", trigger: Date.now() });
        await sleep(1500);
        break;

      case "sleep":
        const sleepTurns = Math.floor(Math.random() * 3) + 1;
        updateTeam((prev) =>
          prev.map((poke) =>
            poke.id === defender.id
              ? { ...poke, isAsleep: true, sleepTurns: sleepTurns }
              : poke,
          ),
        );
        setTextBox(`${defender.name} s'est endormi !`);
        setSound({ type: "sleep", trigger: Date.now() });
        await sleep(1500);
        break;

      case "freeze":
        updateTeam((prev) =>
          prev.map((poke) =>
            poke.id === defender.id ? { ...poke, isFrozen: true } : poke,
          ),
        );
        setTextBox(`${defender.name} est maintenant gelé !`);
        setSound({ type: "freeze", trigger: Date.now() });
        await sleep(1500);
        break;

      case "burn":
        updateTeam((prev) =>
          prev.map((poke) =>
            poke.id === defender.id ? { ...poke, isBurnt: true } : poke,
          ),
        );
        setTextBox(`${defender.name} est maintenant brûlé !`);
        setSound({ type: "burn", trigger: Date.now() });
        await sleep(1500);
        break;

      case "poison":
        updateTeam((prev) =>
          prev.map((poke) =>
            poke.id === defender.id ? { ...poke, isPoisoned: true } : poke,
          ),
        );
        setTextBox(`${defender.name} est maintenant empoisonné !`);
        setSound({ type: "poison-status", trigger: Date.now() });
        await sleep(1500);
        break;

      case "confusion":
        const randomTurns = Math.floor(Math.random() * 4) + 2;
        updateTeam((prev) =>
          prev.map((poke) =>
            poke.id === defender.id
              ? { ...poke, isConfused: true, confusionTurns: randomTurns }
              : poke,
          ),
        );
        setTextBox(`${defender.name} est confus !`);
        setSound({ type: "confusion", trigger: Date.now() });
        await sleep(1500);
        break;

      case "leech-seed":
        updateTeam((prev) =>
          prev.map((poke) =>
            poke.id === defender.id ? { ...poke, isSeeded: true } : poke,
          ),
        );
        setTextBox(`${defender.name} a été infecté par une graine !`);
        await sleep(1500);
        break;
    }

    if (move.healing > 0) {
      const healAmount = Math.floor((attacker.stats.hp * move.healing) / 100);
      const updateAttackerTeam =
        attackerTeam === "user" ? setUserPokemons : setEnemyPokemons;
      updateAttackerTeam((prev) =>
        prev.map((poke) =>
          poke.id === attacker.id
            ? {
                ...poke,
                currentHp: Math.min(poke.stats.hp, poke.currentHp + healAmount),
              }
            : poke,
        ),
      );
      setTextBox(`${attacker.name} a récupéré des forces !`);
      setSound({ type: "leech-seed", trigger: Date.now() });
      await sleep(1500);
    }
  }

  async function applyBuff(
    attacker: PokeBattlePokemonDetails,
    defender: PokeBattlePokemonDetails,
    move: PokeBattlePokemonMove,
    attackerTeam: "user" | "enemy",
  ) {
    const updatedAttackerStats: PokeBattlePokemonStats = { ...attacker.stats };
    const updatedDefenderStats: PokeBattlePokemonStats = { ...defender.stats };
    if (!move.statChanges || move.statChanges.length === 0) return;

    for (const statChange of move.statChanges) {
      const { stat, change } = statChange;

      if (stat === "hp") continue;

      // Déterminer qui reçoit le modificateur
      let targetPokemon = defender; // Par défaut (damage-lower)
      let statsToUpdate = updatedDefenderStats;

      if (move.targetBuff === "damage-raise") {
        targetPokemon = attacker; // Exemple: Close combat
        statsToUpdate = updatedAttackerStats;
      } else if (move.targetBuff === "damage-lower") {
        targetPokemon = defender;
        statsToUpdate = updatedDefenderStats;
      } else if (move.targetBuff === "net-good-stats") {
        if (change > 0) {
          targetPokemon = attacker;
          statsToUpdate = updatedAttackerStats;
        } else {
          targetPokemon = defender;
          statsToUpdate = updatedDefenderStats;
        }
      }

      let multiplier = 1.4;
      if (stat === "accuracy" || stat === "evasion") {
        multiplier = 1.2;
      }
      const currentStatValue = statsToUpdate[stat];

      if (change > 0) {
        const calculatedValue = Math.round(currentStatValue * multiplier);

        if (stat === "accuracy" || stat === "evasion") {
          statsToUpdate[stat] = Math.min(300, calculatedValue); // Limitation à 300 max sinon injouable
        } else {
          statsToUpdate[stat] = Math.min(400, calculatedValue); // Évite que l'attaque/défense n'augmente à l'infini
        }

        setTextBox(
          `${targetPokemon.name} a vu ${statToFrench(stat)} augmenter !`,
        );
        setSound({ type: "stat-up", trigger: Date.now() });
        await sleep(1500);
      } else if (change < 0) {
        const calculatedValue = Math.round(currentStatValue / multiplier);

        if (stat === "accuracy" || stat === "evasion") {
          statsToUpdate[stat] = Math.max(33, calculatedValue); // Limitation à 33 min sinon injouable
        } else {
          statsToUpdate[stat] = Math.max(25, calculatedValue); // Évite qu'une statistique classique ne tombe à 0
        }

        setTextBox(
          `${targetPokemon.name} a vu ${statToFrench(stat)} baisser !`,
        );
        setSound({ type: "stat-down", trigger: Date.now() });
        await sleep(1500);
      }
    }
    const updateAttackerTeam =
      attackerTeam === "user" ? setUserPokemons : setEnemyPokemons;
    const updateDefenderTeam =
      attackerTeam === "user" ? setEnemyPokemons : setUserPokemons;

    // Application des buff au pokemon qui défend
    updateDefenderTeam((prev) => {
      return prev.map((poke) => {
        if (poke.id === defender.id) {
          return {
            ...poke,
            stats: updatedDefenderStats,
          };
        }
        return poke;
      });
    });

    // Application des buff au pokemon qui attaque
    updateAttackerTeam((prev) => {
      return prev.map((poke) => {
        if (poke.id === attacker.id) {
          return {
            ...poke,
            stats: updatedAttackerStats,
          };
        }
        return poke;
      });
    });
  }

  async function applyDrainOrRecoil(
    attacker: PokeBattlePokemonDetails,
    defender: PokeBattlePokemonDetails,
    move: PokeBattlePokemonMove,
    finalDamage: number,
    attackerTeam: "user" | "enemy",
  ) {
    // S'il n'y a pas de drain/recoil ou si aucun dégât n'a été infligé, on ne fait rien
    if (!move.drain || finalDamage <= 0) return;

    const updateAttackerTeam =
      attackerTeam === "user" ? setUserPokemons : setEnemyPokemons;
    const percent = Math.abs(move.drain) / 100;
    const hpChange = Math.floor(finalDamage * percent);

    if (hpChange <= 0) return;

    // CAS DU RECUL (Ex: Bélier, Boutefeu)
    if (move.drain < 0) {
      updateAttackerTeam((prev) =>
        prev.map((poke) =>
          poke.id === attacker.id
            ? { ...poke, currentHp: Math.max(0, poke.currentHp - hpChange) }
            : poke,
        ),
      );
      setTextBox(`${attacker.name} est blessé par le contrecoup !`);
      setSound({ type: "normal_hit", trigger: Date.now() });
      await sleep(1500);
    } else if (move.drain > 0) {
      // CAS DU VOL DE VIE (Ex: Giga-Sangsue, Vampirisme)
      updateAttackerTeam((prev) =>
        prev.map((poke) =>
          poke.id === attacker.id
            ? {
                ...poke,
                currentHp: Math.min(poke.stats.hp, poke.currentHp + hpChange),
              }
            : poke,
        ),
      );
      setTextBox(`L'énergie de ${defender.name} a été aspirée !`);
      setSound({ type: "leech-seed", trigger: Date.now() });
      await sleep(1500);
    }
  }

  async function applyDamage(
    attacker: PokeBattlePokemonDetails,
    defender: PokeBattlePokemonDetails,
    move: PokeBattlePokemonMove,
    attackerTeam: "user" | "enemy",
  ) {
    const isAttackSuccess = await attackSuccess(attacker, defender, move);
    if (!isAttackSuccess) return;

    try {
      const atk =
        move.category === "physical"
          ? attacker.stats.attack
          : attacker.stats["special-attack"];
      const def =
        move.category === "physical"
          ? defender.stats.defense
          : defender.stats["special-defense"];

      const typeMatch = defender.typeChart?.find(
        (t) => t.name.toLowerCase() === move.type.toLowerCase(),
      );
      const multiplier = typeMatch ? typeMatch.multiplier : 1;

      const calculateSingleHitDamage = (isCritical: boolean) => {
        const baseDamage = (22 * move.power * atk) / def / 50 + 2;
        const critMultiplier = isCritical ? 1.5 : 1;
        return Math.floor(baseDamage * multiplier * critMultiplier);
      };

      let totalDamageApplied = 0;
      let hasTriggeredCrit = false;
      let shouldApplyFlinch = false;
      const isMultiHit = !!(move.minHits && move.maxHits > 1);

      const updateTeam =
        attackerTeam === "user" ? setEnemyPokemons : setUserPokemons;

      if (isMultiHit) {
        // Détermination du nombre de coups
        const totalHits = determineHitCount(move);

        let currentHp = defender.currentHp;
        let actualHits = 0;

        for (let i = 0; i < totalHits; i++) {
          // Vérification de K.O. avant d'attaquer
          if (currentHp <= 0) break;

          const isCrit = checkIsCritical(move || 0);
          const damage = calculateSingleHitDamage(isCrit);

          // Mise à jour de la variable locale
          currentHp = Math.max(0, currentHp - damage);
          totalDamageApplied += damage;
          actualHits++;

          // Mise à jour visuelle du state pour ce coup précis
          updateTeam((prev) =>
            prev.map((poke) =>
              poke.id === defender.id ? { ...poke, currentHp } : poke,
            ),
          );

          setSound({ type: "normal_hit", trigger: Date.now() });

          if (isCrit) {
            setTextBox("Un coup critique !");
            await sleep(1200);
          }

          // Gestion du Flinch
          if (move.flinchChance > 0 && !shouldApplyFlinch && currentHp > 0) {
            if (Math.random() * 100 <= move.flinchChance) {
              shouldApplyFlinch = true;
            }
          }

          if (!isCrit) {
            await sleep(1200);
          }
        }

        if (actualHits > 0) {
          setTextBox(`Touché ${actualHits} fois !`);
          await sleep(1500);
        }
      } else {
        // Attaque classique les dégâts totaux correspondent au finalDamage
        const isCrit = checkIsCritical(move || 0);
        if (isCrit) hasTriggeredCrit = true;

        totalDamageApplied = calculateSingleHitDamage(isCrit);
        await sleep(600);
      }

      // Calcul exact des PV restants du défenseur après l'intégralité des coups
      const defenderRemainingHp = Math.max(
        0,
        defender.currentHp - totalDamageApplied,
      );
      const canApplyStatus = multiplier > 0 && defenderRemainingHp > 0;

      // ------------- Gestion des status a appliquer après l'attaque -----------------//
      // Gestion de paralysis
      let shouldApplyParalysis = false;
      if (
        move.status === "paralysis" &&
        !defender.isParalyze &&
        canApplyStatus
      ) {
        const paralyzeChance =
          move.statusChance === 0 ? 100 : move.statusChance;
        shouldApplyParalysis = Math.random() * 100 <= paralyzeChance;
      }

      // Gestion de l'endormissement
      let shouldApplySleep = false;
      let sleepTurns = 0;
      if (move.status === "sleep" && !defender.isAsleep && canApplyStatus) {
        const sleepChance = move.statusChance === 0 ? 100 : move.statusChance;
        shouldApplySleep = Math.random() * 100 <= sleepChance;
        if (shouldApplySleep) {
          sleepTurns = Math.floor(Math.random() * 3) + 1;
        }
      }

      // Gestion du gel
      let shouldApplyFreeze = false;
      if (move.status === "freeze" && !defender.isFrozen && canApplyStatus) {
        const freezeChance = move.statusChance === 0 ? 100 : move.statusChance;
        shouldApplyFreeze = Math.random() * 100 <= freezeChance;
      }

      // Gestion de la brulure
      let shouldApplyBurn = false;
      if (move.status === "burn" && !defender.isBurnt && canApplyStatus) {
        const burnChance = move.statusChance === 0 ? 100 : move.statusChance;
        shouldApplyBurn = Math.random() * 100 <= burnChance;
      }

      // Gestion du poison
      let shouldApplyPoison = false;
      if (move.status === "poison" && !defender.isPoisoned && canApplyStatus) {
        const poisonChance = move.statusChance === 0 ? 100 : move.statusChance;
        shouldApplyPoison = Math.random() * 100 <= poisonChance;
      }

      // Gestion de la confusion
      let shouldApplyConfusion = false;
      let confusionTurns = 0;
      if (
        move.status === "confusion" &&
        !defender.isConfused &&
        canApplyStatus
      ) {
        const confusionChance =
          move.statusChance === 0 ? 100 : move.statusChance;
        shouldApplyConfusion = Math.random() * 100 <= confusionChance;
        if (shouldApplyConfusion) {
          confusionTurns = Math.floor(Math.random() * 4) + 2;
        }
      }

      // Gestion de leech-seed
      let shouldApplyLeechSeed = false;
      if (
        move.status === "leech-seed" &&
        !defender.isSeeded &&
        canApplyStatus
      ) {
        const leechSeedChance =
          move.statusChance === 0 ? 100 : move.statusChance;
        shouldApplyLeechSeed = Math.random() * 100 <= leechSeedChance;
      }

      // Gestion de flinch (Seulement pour les attaques monocoups, les multi-hits sont gérés dans la boucle)
      if (
        !isMultiHit &&
        move.flinchChance > 0 &&
        !defender.isFlinch &&
        canApplyStatus
      ) {
        shouldApplyFlinch = Math.random() * 100 <= move.flinchChance;
      }

      if (RECHARGE_MOVES.includes(move.name)) {
        await applyRecharge(attacker, attackerTeam);
      }

      // ---------------------------------------------------------------- //

      await applyBuff(attacker, defender, move, attackerTeam);
      await sleep(150);

      // Application des statuts et synchronisation finale des PV
      updateTeam((prev) => {
        return prev.map((poke) => {
          if (poke.id === defender.id) {
            return {
              ...poke,
              currentHp: defenderRemainingHp,
              isParalyze: shouldApplyParalysis ? true : poke.isParalyze,
              isAsleep: shouldApplySleep ? true : poke.isAsleep,
              sleepTurns: shouldApplySleep ? sleepTurns : poke.sleepTurns,
              isFrozen: shouldApplyFreeze ? true : poke.isFrozen,
              isBurnt: shouldApplyBurn ? true : poke.isBurnt,
              isPoisoned: shouldApplyPoison ? true : poke.isPoisoned,
              isConfused: shouldApplyConfusion ? true : poke.isConfused,
              confusionTurns: shouldApplyConfusion
                ? confusionTurns
                : poke.confusionTurns,
              isSeeded: shouldApplyLeechSeed ? true : poke.isSeeded,
              isFlinch: shouldApplyFlinch ? true : poke.isFlinch,
            };
          }
          return poke;
        });
      });

      if (hasTriggeredCrit) {
        setTextBox("Un coup critique !");
        await sleep(500);
      }

      if (multiplier > 1) {
        setTextBox("C'est super efficace !");
        if (!isMultiHit) {
          setIsAttacking(true);
          setSound({ type: "effective", trigger: Date.now() });
        }
        await sleep(1500);
      } else if (multiplier < 1 && multiplier > 0) {
        setTextBox("Ce n'est pas très efficace...");
        if (!isMultiHit) {
          setIsAttacking(true);
          setSound({ type: "weak", trigger: Date.now() });
        }
        await sleep(1500);
      } else if (multiplier === 1) {
        if (!isMultiHit) {
          setIsAttacking(true);
          setSound({ type: "normal_hit", trigger: Date.now() });
        }
        await sleep(1000);
      } else if (multiplier === 0) {
        !isMultiHit && setIsAttacking(true);
        setTextBox(`Ça n'affecte pas ${defender.name}...`);
        await sleep(1500);
        return;
      }

      // On passe totalDamageApplied au lieu de finalDamage pour que le Recoil/Drain calcule sur TOUS les coups
      await applyDrainOrRecoil(
        attacker,
        defender,
        move,
        totalDamageApplied,
        attackerTeam,
      );

      // ------------- Affichage des boites de dialogue de statut ------------- //
      if (shouldApplyParalysis) {
        setTextBox(`${defender.name} est maintenant paralysé !`);
        await sleep(1500);
      }
      if (shouldApplySleep) {
        setTextBox(`${defender.name} s'est endormi !`);
        await sleep(1500);
      }
      if (shouldApplyFreeze) {
        setTextBox(`${defender.name} est totalement gelé !`);
        await sleep(1500);
      }
      if (shouldApplyBurn) {
        setTextBox(`${defender.name} est maintenant brûlé !`);
        await sleep(1500);
      }
      if (shouldApplyPoison) {
        setTextBox(`${defender.name} est maintenant empoisonné !`);
        await sleep(1500);
      }
      if (shouldApplyConfusion) {
        setTextBox(`${defender.name} est maintenant confus !`);
        await sleep(1500);
      }
      if (shouldApplyLeechSeed) {
        setTextBox(`${defender.name} a été infecté par une graine !`);
        await sleep(1500);
      }
    } finally {
      setIsAttacking(false);
    }
  }

  async function applyRecharge(
    defender: PokeBattlePokemonDetails,
    attackerTeam: "user" | "enemy",
  ) {
    const updateAttackerTeam =
      attackerTeam === "user" ? setUserPokemons : setEnemyPokemons;
    console.log("recharge ON pour", defender.name);
    updateAttackerTeam((prev) =>
      prev.map((poke) =>
        poke.id === defender.id ? { ...poke, isRecharging: true } : poke,
      ),
    );
    await sleep(100);
  }

  function determineHitCount(move: PokeBattlePokemonMove) {
    // 1. Si le Pokémon a le talent "Multi-Coups" (Skill Link), 5 hits garantis
    if (move.name === "Multi-Coups") return 5;

    // 2. Si l'attaque est fixe (ex: Double Pied = 2)
    if (move.minHits === move.maxHits) return move.minHits;

    // 3. Probabilités officielles pour attaques 2-5 hits (Balle Graine, etc.)
    if (move.minHits === 2 && move.maxHits === 5) {
      const rand = Math.random();
      if (rand < 0.375) return 2; // 37.5%
      if (rand < 0.75) return 3; // 37.5%
      if (rand < 0.875) return 4; // 12.5%
      return 5; // 12.5%
    }

    // 4. Fallback pour des cas personnalisés (ex: 2-3 hits)
    return (
      Math.floor(Math.random() * (move.maxHits - move.minHits + 1)) +
      move.minHits
    );
  }

  function checkIsCritical(move: PokeBattlePokemonMove): boolean {
    // Ici, on part du principe que l'étage de base est le crit_rate du move.
    // Tu pourras y ajouter +1 ou +2 plus tard si tu implémentes les objets/talents.

    const rand = Math.random();
    if (move.critRate === 0) return rand < 1 / 24; // ~4.17%
    if (move.critRate === 1) return rand < 1 / 8; // 12.5%
    if (move.critRate === 2) return rand < 1 / 2; // 50%
    return true;
  }

  async function attackSuccess(
    attacker: PokeBattlePokemonDetails,
    defender: PokeBattlePokemonDetails,
    move: PokeBattlePokemonMove,
  ) {
    let applyAttack = true;

    if (move.accuracy !== null) {
      // Récupération des stats actuelles
      const attackerAccuracy = attacker.stats.accuracy ?? 100;
      const defenderEvasion = defender.stats.evasion ?? 100;

      const statRatio = attackerAccuracy / defenderEvasion;

      // Calcul de la précision finale plafonnée à 100%
      const finalAccuracy = Math.min(100, move.accuracy * statRatio);

      // Jet de dés
      applyAttack = Math.random() * 100 <= finalAccuracy;
    }

    if (!applyAttack) {
      setTextBox(`Mais cela échoue !`);
      await sleep(1500);
    }
    return applyAttack;
  }

  async function startGame(trainer?: PokeBattleTrainer) {
    const nbPokemon = trainer ? 6 : 3;
    setIsFetching(true);
    const myTeam = trainer?.pokemons
      ? await getPokemonTeam(nbPokemon)
      : await getPokemonTeam();
    const enemyTeam = trainer?.pokemons
      ? await getPokemonTeam(nbPokemon, trainer.pokemons)
      : await getPokemonTeam();

    trainer !== undefined ? setTrainer(trainer) : setTrainer(null);
    setEnemyObjects(POKEBATTLE_OBJECTS);
    setUserObjects(POKEBATTLE_OBJECTS);
    setIsFetching(false);
    setUserPokemons(myTeam);
    setEnemyPokemons(enemyTeam);
    setGameStatus("presentation");
  }

  async function startBattle() {
    const isMyPokemonFaster =
      userPokemons[0].stats.speed >= enemyPokemons[0].stats.speed;

    if (isMyPokemonFaster) {
      setGameStatus("user_turn");
      setTargetTeam("enemy");
      setTextBox(`Que doit faire ${userPokemons[0].name} ?`);
    } else {
      setGameStatus("enemy_turn");
      setTargetTeam("user");
    }
  }

  async function goToWaitingScreen() {
    setGameStatus("waiting");
  }

  async function addToLeaderboard(score: IPokeBatlle) {
    setLeaderboard([...leaderboard, score]);
  }

  function updateLeaderboard(scoreToUpdateId: string, score: IPokeBatlle) {
    setLeaderboard((prevLeaderboard) =>
      prevLeaderboard.map((prevLeaderboard) => {
        if (prevLeaderboard._id === scoreToUpdateId) {
          return { ...score };
        } else {
          return prevLeaderboard;
        }
      }),
    );
  }

  return (
    <PokeBattleContext.Provider
      value={{
        gameStatus,
        leaderboard,
        isActionPending,
        isAttacking,
        isFetching,
        userPokemons,
        enemyPokemons,
        enemyObjects,
        userObjects,
        sound,
        types,
        textBox,
        trainer,
        startGame,
        addToLeaderboard,
        updateLeaderboard,
        startBattle,
        goToWaitingScreen,
        handleUserAttack,
        handlePokemonReplacement,
        handleObjectUse,
        setTextBox,
      }}
    >
      {children}
    </PokeBattleContext.Provider>
  );
}

export function usePokeBattle() {
  const context = useContext(PokeBattleContext);
  if (!context) {
    throw new Error(
      "usePokeBattle doit être utilisé au sein d'un PokeBattleProvider",
    );
  }
  return context;
}
