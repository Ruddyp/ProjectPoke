"use client";
import {
  PokeBattleBuffOption,
  PokeBattleGameStatus,
  PokeBattleMode,
  PokeBattleObject,
  PokeBattleObjectType,
  PokeBattlePokemonDetails,
  PokeBattlePokemonMove,
  PokeBattlePokemonStats,
  PokeBattleSound,
  PokeBattleTrainer,
  Types,
} from "@/app/type";
import { getPokemonDetails } from "@/lib/fetch";
import {
  BATTLE_MUSIC,
  calculatePokemonPower,
  calculatePokemonTeamPower,
  getPokemonTeam,
  getRandomMoves,
  getRandomNumber,
  hasStatus,
  POKEBATTLE_OBJECTS,
  RECHARGE_MOVES,
  sleep,
  statToFrench,
  TYPE_DEFENSE_MULTIPLIERS,
  VICTORY_MUSIC,
} from "@/lib/utils";
import { IPokeBatlle } from "@/models/pokebattle_leaderboard";
import {
  createContext,
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

type PokeBattleContextType = {
  gameStatus: PokeBattleGameStatus;
  userPokemons: PokeBattlePokemonDetails[];
  enemyPokemons: PokeBattlePokemonDetails[];
  userObjects: PokeBattleObject[];
  enemyObjects: PokeBattleObject[];
  isActionPending: boolean;
  isFetching: boolean;
  isDrafting: boolean;
  isAttacking: boolean;
  opponentForfait: boolean;
  rematchProposed: boolean;
  opponentWantsRematch: boolean;
  userScore: number;
  enemyScore: number;
  towerPoint: number;
  floor: number;
  roomActuelle: string;
  leaderboard: IPokeBatlle[];
  battleMode: PokeBattleMode;
  sound: { type: PokeBattleSound; trigger: number } | null;
  types: Types[];
  trainer: PokeBattleTrainer | null;
  textBox: string;
  socket: Socket | null;
  opponentSocketId: string | null;
  draftChoices: PokeBattlePokemonDetails[];
  towerBuff: PokeBattleBuffOption[];
  nextRoundResolver: MutableRefObject<((value: any) => void) | null>;
  setPokemonStatsBeforeMatch: Dispatch<
    SetStateAction<PokeBattlePokemonStats[]>
  >;
  setTowerBuff: Dispatch<SetStateAction<PokeBattleBuffOption[]>>;
  loadTowerFloor(nextFloor: number): Promise<void>;
  setSocket: (socket: any | null) => void;
  setOpponentSocketId: (id: string | null) => void;
  startGame: (trainer?: PokeBattleTrainer) => void;
  startBattle: (socketId?: string, opponentSocketId?: string) => Promise<void>;
  setEnemyScore: Dispatch<SetStateAction<number>>;
  setTowerPoint: Dispatch<SetStateAction<number>>;
  setFloor: Dispatch<SetStateAction<number>>;
  setGameStatus: Dispatch<SetStateAction<PokeBattleGameStatus>>;
  setEnemyPokemons: Dispatch<SetStateAction<PokeBattlePokemonDetails[]>>;
  setUserPokemons: Dispatch<SetStateAction<PokeBattlePokemonDetails[]>>;
  setUserObjects: Dispatch<SetStateAction<PokeBattleObject[]>>;
  preparePvPBattle: (socket: Socket, roomId: string) => void;
  goToWaitingScreen: () => void;
  handleRequestRematch: () => void;
  addToLeaderboard: (score: IPokeBatlle) => void;
  updateLeaderboard: (idToUpdate: string, score: IPokeBatlle) => void;
  handleUserAttack: (move: PokeBattlePokemonMove) => Promise<void>;
  handleUserSwitch: (id: number) => void;
  handleUserObjectUse: (type: PokeBattleObjectType, id: number) => void;
  setTextBox: Dispatch<SetStateAction<string>>;
  setBattleMode: Dispatch<SetStateAction<PokeBattleMode>>;
  setRoomActuelle: Dispatch<SetStateAction<string>>;
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
  const [isDrafting, setIsDrafting] = useState(false);
  const [sound, setSound] = useState<{
    type: PokeBattleSound;
    trigger: number;
  } | null>(null);
  const [enemyScore, setEnemyScore] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [battleMode, setBattleMode] = useState<PokeBattleMode>("pve");
  const [socket, setSocket] = useState<any | null>(null);
  const [opponentSocketId, setOpponentSocketId] = useState<string | null>(null);
  const [roomActuelle, setRoomActuelle] = useState<string>("");
  const [opponentForfait, setOpponentForfait] = useState<boolean>(false);
  const [rematchProposed, setRematchProposed] = useState<boolean>(false);
  const [opponentWantsRematch, setOpponentWantsRematch] =
    useState<boolean>(false);
  const [draftChoices, setDraftChoices] = useState<PokeBattlePokemonDetails[]>(
    [],
  );
  const [floor, setFloor] = useState(1);
  const [towerPoint, setTowerPoint] = useState(0);
  const [pokemonStatsBeforeMatch, setPokemonStatsBeforeMatch] = useState<
    PokeBattlePokemonStats[]
  >([]);
  const [towerBuff, setTowerBuff] = useState<PokeBattleBuffOption[]>([]);
  const nextRoundResolver = useRef<((value: any) => void) | null>(null);

  const getActivePokemon = (pokemons: PokeBattlePokemonDetails[]) => {
    return (
      pokemons.find((poke) => poke.isActive && poke.stats.hp > 0) ??
      pokemons.find((p) => p.stats.hp > 0) ??
      pokemons[0]
    );
  };

  const getPokemon = (pokemons: PokeBattlePokemonDetails[], id: number) => {
    return pokemons.find((poke) => poke.id === id);
  };
  const URL_SERVEUR = process.env.NEXT_PUBLIC_ADDRESS;

  useEffect(() => {
    if (!URL_SERVEUR) return;

    const nouveauSocket = io(URL_SERVEUR);
    setSocket(nouveauSocket);

    // Nettoyage à la fermeture de l'application
    return () => {
      nouveauSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handlePlayerJoined = (data: { playerId: string }) => {
      setOpponentSocketId(data.playerId);
    };

    const handleOpponentRequestedRematch = () => {
      setOpponentWantsRematch(true);
    };

    const handleRematchStart = async () => {
      setOpponentForfait(false);
      setRematchProposed(false);
      setOpponentWantsRematch(false);
      setGameStatus("waiting");
      preparePvPBattle(socket, roomActuelle);
    };

    const handleBattleReady = async () => {
      if (roomActuelle) {
        preparePvPBattle(socket, roomActuelle);
      }
    };

    const handleTeamsSynchronized = async (data: {
      enemyTeam: any;
      opponentId: string;
    }) => {
      setIsDrafting(false);
      setEnemyPokemons(data.enemyTeam);
      setOpponentSocketId(data.opponentId);
      setEnemyObjects(POKEBATTLE_OBJECTS);
      setEnemyScore(calculatePokemonTeamPower(data.enemyTeam));
      setGameStatus("presentation");
    };

    const handleReceiveMove = async (data: any) => {
      if (data.actionType === "attack") {
        // L'adversaire a attaqué, on exécute l'action côté "enemy"
        await executeAttackAction(data.detail, "enemy", data.randomPool);
      }

      if (data.actionType === "switch") {
        // L'adversaire a changé de Pokémon, on exécute l'action côté "enemy"
        await handlePokemonReplacement(data.detail, "enemy");
      }

      if (data.actionType === "object") {
        // L'adversaire a utilisé un objet, on exécute l'action côté "enemy"
        const { objectType, id } = data.detail;
        await handleObjectUse(objectType, "enemy", id);
      }
    };

    const handlePlayerLeft = () => {
      // Si on est en écran de présentation ou en plein combat
      if (
        (gameStatus === "waiting" && isDrafting === true) ||
        gameStatus === "presentation" ||
        gameStatus === "user_turn" ||
        gameStatus === "enemy_turn" ||
        gameStatus === "intermission"
      ) {
        setOpponentForfait(true);
        setIsDrafting(false);
        setGameStatus("ending");
      } else {
        // Si on était juste dans le salon d'attente, on reset juste l'adversaire
        setOpponentSocketId(null);
      }
    };

    // On attache les écouteurs
    socket.on("player_joined", handlePlayerJoined);
    socket.on("battle_ready", handleBattleReady);
    socket.on("teams_synchronized", handleTeamsSynchronized);
    socket.on("receive_move", handleReceiveMove);
    socket.on("player_left", handlePlayerLeft);
    socket.on("opponent_requested_rematch", handleOpponentRequestedRematch);
    socket.on("rematch_start", handleRematchStart);

    // Supprime les anciens écouteurs pour éviter les doublons
    return () => {
      socket.off("player_joined", handlePlayerJoined);
      socket.off("battle_ready", handleBattleReady);
      socket.off("teams_synchronized", handleTeamsSynchronized);
      socket.off("receive_move", handleReceiveMove);
      socket.off("player_left", handlePlayerLeft);
      socket.off("opponent_requested_rematch", handleOpponentRequestedRematch);
      socket.off("rematch_start", handleRematchStart);
    };
  }, [socket, roomActuelle, userPokemons, enemyPokemons, gameStatus]);

  useEffect(() => {
    if (battleMode !== "tower") return;
    startGame();
  }, [battleMode]);

  // TOUR DE L'ENNEMI
  useEffect(() => {
    if (gameStatus !== "enemy_turn" || battleMode === "pvp") return;
    handleEnemyTurn();
  }, [gameStatus, battleMode]);

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

        if (battleMode === "tower" && result === "ended" && element.isEnemy) {
          setFloor((prev) => prev + 1);
          setTowerPoint((prev) => prev + 60);
          setUserPokemons((prevPokemons) => {
            return prevPokemons.map((pokemon, index) => {
              const pokemonStats = pokemonStatsBeforeMatch[index];
              return {
                ...pokemon,
                stats: {
                  ...pokemonStats,
                },
              };
            });
          });
          setGameStatus("tower_market");
          return;
        }

        if (result === "ended") {
          setGameStatus("ending");
          return;
        }
      }

      // Si aucun mort, on passe au tour suivant
      const nextTurnStatus =
        targetTeam === "enemy" ? "enemy_turn" : "user_turn";
      setGameStatus(nextTurnStatus);

      if (nextTurnStatus === "user_turn") {
        const activeUser = getActivePokemon(userPokemons);
        if (activeUser && activeUser.currentHp > 0) {
          setTextBox(`Que doit faire ${activeUser.name} ?`);
        }
      } else {
        if (battleMode === "pvp") {
          setTextBox("C'est au tour de l'adversaire...");
        }
      }
    }

    runIntermissionPhase();
  }, [gameStatus, targetTeam, enemyPokemons, userPokemons, battleMode]);

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
              isRecharging: false,
              isConfused: false,
              isFlinch: false,
            };
          if (p.id === nextPokemon.id) return { ...p, isActive: true };
          return p;
        });
      });

      if (!isEnemy) {
        setTextBox(`Que doit faire ${nextPokemon.name} ?`);
      } else {
        if (battleMode === "pvp") {
          setTextBox("C'est au tour de l'adversaire...");
        }
      }

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
              setTextBox(`${p.name}, a repris des forces !`);
              setSound({ type: "leech-seed", trigger: Date.now() });
              return {
                ...p,
                currentHp: newHp,
              };
            }
            return p;
          });
        });
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
              setTextBox(`${p.name}, a retrouvé la forme !`);
              setSound({ type: "leech-seed", trigger: Date.now() });
              return {
                ...p,
                currentHp: newHp,
              };
            }
            return p;
          });
        });
        await sleep(1500);
        break;
      case "status":
        updateTeam((prev) => {
          return prev.map((p) => {
            if (p.id === id) {
              setTextBox(`${p.name}, a été soigné de ses status !`);
              setSound({ type: "leech-seed", trigger: Date.now() });
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

  async function handleUserObjectUse(
    objectType: PokeBattleObjectType,
    id: number,
  ) {
    if (isActionPending || gameStatus !== "user_turn") return;

    if (battleMode === "pvp") {
      if (!socket || !roomActuelle) return;

      socket.emit("send_move", {
        roomId: roomActuelle,
        senderId: socket.id,
        actionType: "object",
        detail: {
          objectType,
          id,
        },
      });
    }

    await handleObjectUse(objectType, "user", id);
  }

  async function handleUserSwitch(id: number) {
    // Sécurité pour éviter le spam ou changer de Pokémon hors de son tour
    if (isActionPending || gameStatus !== "user_turn") return;

    if (battleMode === "pvp") {
      if (!socket || !roomActuelle) return;

      // Même format de payload que pour l'attaque, mais avec l'action "switch" 🔄
      socket.emit("send_move", {
        roomId: roomActuelle,
        senderId: socket.id,
        actionType: "switch",
        detail: id, // On envoie juste l'ID du Pokémon qui entre au combat
      });
    }

    // On lance l'exécution des animations et du changement d'état chez le joueur
    await handlePokemonReplacement(id, "user");
  }

  async function handleEnemyChoice() {
    const activeEnemy = getActivePokemon(enemyPokemons);
    const activeUser = getActivePokemon(userPokemons);

    const enemyHpPct = (activeEnemy.currentHp / activeEnemy.stats.hp) * 100;
    const userHpPct = (activeUser.currentHp / activeUser.stats.hp) * 100;

    const isEnemyInDanger = enemyHpPct <= 35;
    const isUserKillable = userHpPct <= 25;

    // Analyse des objets disponibles
    const deadEnemyPokemons = enemyPokemons.filter((p) => p.currentHp <= 0);
    const hasAntidote = enemyObjects.some(
      (o) => o.type === "status" && o.quantity > 0,
    );
    const hasPotion = enemyObjects.some(
      (o) => o.type === "heal" && o.quantity > 0,
    );
    const hasReborn = enemyObjects.some(
      (o) => o.type === "reborn" && o.quantity > 0,
    );

    // ==========================================
    // RÈGLE 1 : Finisher
    // ==========================================
    // Si le Pokémon joueur est presque mort, l'IA ne doit PAS gaspiller son tour
    // à se soigner ou utiliser un objet. Elle doit attaquer pour sécuriser le KO !
    if (isUserKillable && activeEnemy.currentHp > 0) {
      return true; // Passe directement à la phase d'attaque
    }

    // ==========================================
    // RÈGLE 2 : Potion
    // ==========================================
    // Si l'ennemi est en danger et qu'il a une potion, il se soigne à coup sûr,
    // SAUF si le joueur est aussi à portée de KO (géré par la règle 1).
    if (isEnemyInDanger && hasPotion) {
      setTextBox(
        `${trainer?.name ?? "L'adversaire"} utilise une Potion sur ${activeEnemy.name} !`,
      );
      await sleep(1500);
      await handleObjectUse("heal", "enemy", activeEnemy.id);
      return false;
    }

    // ==========================================
    // RÈGLE 3 : RAPPEL
    // ==========================================
    if (deadEnemyPokemons.length >= 3 && hasReborn) {
      const AI_INTELLIGENCE = trainer?.intelligence ?? 0.5;

      const getSEC = (p: PokeBattlePokemonDetails) => {
        const s = p.stats;
        const typeMultipliers = p.types.map(
          (t) => TYPE_DEFENSE_MULTIPLIERS[t] || 1.0,
        );
        const avgTypeMultiplier =
          typeMultipliers.reduce((a, b) => a + b, 0) / typeMultipliers.length;
        const offense = Math.max(s.attack, s["special-attack"]);
        const defense =
          (s.hp + s.defense + s["special-defense"]) * avgTypeMultiplier;
        return 1.5 * offense + defense;
      };

      const getAdvantageScore = (
        deadPokemon: PokeBattlePokemonDetails,
        userPokemon: PokeBattlePokemonDetails,
      ) => {
        const multipliers = deadPokemon.types.map(
          (t) =>
            userPokemon.typeChart?.find(
              (ct) => ct.name.toLowerCase() === t.toLowerCase(),
            )?.multiplier ?? 1,
        );
        return Math.max(...multipliers);
      };

      // 1. Calcul du score pour chaque Pokémon mort
      const scoredDead = deadEnemyPokemons.map((p) => {
        // Score de puissance pure (SEC)
        const sec = getSEC(p);

        // Bonus tactique : est-ce qu'il a un avantage de type contre l'adversaire actuel ?
        const typeAdvantage = getAdvantageScore(p, activeUser); // Fonction définie précédemment

        // Le score final est un mix entre puissance brute et utilité tactique
        // Plus l'IA est intelligente, plus elle donne de poids à l'avantage de type
        const tactiqueWeight = AI_INTELLIGENCE * 2; // Multiplicateur d'intelligence
        return { p, score: sec + typeAdvantage * 100 * tactiqueWeight };
      });

      // 2. Choisir le Pokémon à ressusciter
      let bestPokemonToRevive;

      if (Math.random() < AI_INTELLIGENCE) {
        // IA INTELLIGENTE : Choisit le meilleur selon le score tactique
        bestPokemonToRevive = scoredDead.sort((a, b) => b.score - a.score)[0].p;
      } else {
        // IA MOINS INTELLIGENTE : Choisit purement par la force brute (SEC) ou au hasard
        bestPokemonToRevive = scoredDead.sort(
          (a, b) => getSEC(b.p) - getSEC(a.p),
        )[0].p;
      }

      // 3. Condition de déclenchement
      // Une IA intelligente attendra le moment opportun (50% HP),
      // une IA "bourrine" peut se permettre de rappeler plus vite si elle est en panique.
      const isSafe =
        enemyHpPct > 50 ||
        enemyPokemons.filter((p) => p.currentHp > 0).length === 1;
      const isPanicking = enemyHpPct < 20 && AI_INTELLIGENCE < 0.5; // La panique rend l'IA moins patiente

      if (isSafe || isPanicking) {
        setTextBox(
          `${trainer?.name ?? "L'adversaire"} utilise un Rappel sur ${bestPokemonToRevive.name} !`,
        );
        await sleep(1500);
        await handleObjectUse("reborn", "enemy", bestPokemonToRevive.id);
        return false;
      }
    }

    // ==========================================
    // RÈGLE 4 : NETTOYAGE D'ALTÉRATION (Antidote)
    // ==========================================
    // Si le Pokémon est altéré on clean le statut
    // On le fait si les PV sont encore corrects (>35%) pour ne pas gâcher un tour si on est bas en PV.
    const shouldUseAntidote = hasStatus(activeEnemy);

    if (!isEnemyInDanger && shouldUseAntidote && hasAntidote) {
      setTextBox(
        `${trainer?.name ?? "L'adversaire"} utilise un Antidote sur ${activeEnemy.name} !`,
      );
      await sleep(1500);
      await handleObjectUse("status", "enemy", activeEnemy.id);
      return false;
    }

    return true;
  }

  function handleEnemyMove(
    activeEnemy: PokeBattlePokemonDetails,
    activeUser: PokeBattlePokemonDetails,
  ): PokeBattlePokemonMove {
    const AI_INTELLIGENCE = trainer?.intelligence ?? 0.5;

    const movesPool = getRandomMoves(activeEnemy.moves);
    const isPlayingSmart = Math.random() < AI_INTELLIGENCE;
    // L'ennemie utilise une attaque aléatoire
    if (!isPlayingSmart) {
      return movesPool[Math.floor(Math.random() * movesPool.length)];
    }

    // ÉVALUATION D'UTILITÉ (Scoring de chaque attaque)
    const scoredMoves = movesPool.map((m) => {
      let score = 0;

      // Dégâts théoriques (avec gestion multi-hit, précision et STAB/Type)
      if (m.power > 0) {
        // Espérance mathématique pour les multi-hits
        let avgHits = 1;
        if (m.minHits === m.maxHits) avgHits = m.minHits;
        else if (m.minHits === 2 && m.maxHits === 5) avgHits = 3;
        else avgHits = (m.minHits + m.maxHits) / 2;

        const offensiveStat =
          m.category === "physical"
            ? activeEnemy.stats.attack
            : activeEnemy.stats["special-attack"];
        const multiplier =
          activeUser.typeChart?.find(
            (t) => t.name.toLowerCase() === m.type.toLowerCase(),
          )?.multiplier ?? 1;

        // Calcul puissance réelle
        let damage = m.power * avgHits * offensiveStat * multiplier;
        if (
          activeEnemy.types
            .map((t) => t.toLowerCase())
            .includes(m.type.toLowerCase())
        )
          damage *= 1.5; // Application du STAB

        // Pénalité de précision et recoil et recharge
        if (RECHARGE_MOVES.includes(m.name)) damage /= 2;
        // Pénalité de RECOIL
        // Si l'attaque a un effet de drain de type négatif
        if (m.drain < 0) {
          const healthPercent = activeEnemy.currentHp / activeEnemy.stats.hp;
          if (healthPercent < 0.4) damage *= 0.5;
        }
        score += (damage / 10) * ((m.accuracy ?? 100) / 100);
      }

      // Effets contextuels (Soins, Statuts, Buffs)
      if (m.healing > 0 && activeEnemy.currentHp < activeEnemy.stats.hp * 0.5)
        score += 100;
      if (m.status !== "none") score += 40 * (m.statusChance / 100);
      if (m.statChanges.length > 0) score += m.statChanges.length * 20;
      if (m.drain > 0 && activeEnemy.currentHp < activeEnemy.stats.hp * 0.6)
        score += 30;

      return {
        move: m,
        score,
        theoreticalDamage:
          m.power * (m.minHits || 1) * activeEnemy.stats.attack,
      };
    });

    // FILTRAGE ET TRI
    const viableMoves = scoredMoves.filter(
      (sm) => sm.score > 0 || sm.move.power > 0,
    );
    const movesToAnalyze: {
      move: PokeBattlePokemonMove;
      score: number;
      theoreticalDamage: number;
    }[] = viableMoves.length > 0 ? viableMoves : scoredMoves;
    const bestMoves = [...movesToAnalyze].sort((a, b) => b.score - a.score);

    // INSTINCT DE FINISHER
    const isUserLowHp = activeUser.currentHp <= activeUser.stats.hp / 4;
    const canKill = bestMoves.find(
      (m) => m.theoreticalDamage >= activeUser.currentHp,
    );

    if (isUserLowHp && canKill) {
      return canKill.move;
    }

    // CHOIX FINAL (avec petite variance de 35% pour la crédibilité)
    if (bestMoves.length > 1 && Math.random() < 0.35) {
      return bestMoves[1].move;
    }
    return bestMoves[0].move;
  }

  // TOUR DE L'ENNEMI (PVE)
  async function handleEnemyTurn() {
    const activeEnemy = getActivePokemon(enemyPokemons);
    const activeUser = getActivePokemon(userPokemons);

    setTextBox(`Au tour de ${activeEnemy.name} de jouer !`);
    await sleep(2000);

    try {
      if (await isRecharging(activeEnemy, "enemy")) return;
      const shouldAttack = await handleEnemyChoice();
      if (!shouldAttack) return;

      const move = handleEnemyMove(activeEnemy, activeUser);

      await executeAttackAction(move, "enemy");
    } finally {
      setGameStatus("intermission");
      setTargetTeam("user");
    }
  }

  // TOUR DU JOUEUR
  async function handleUserAttack(move: PokeBattlePokemonMove) {
    if (isActionPending || gameStatus !== "user_turn") return;

    if (battleMode === "pvp") {
      if (!socket || !roomActuelle) return;

      // Génération d'un pool de RNG
      const randomPool = Array.from({ length: 100 }, () => Math.random());

      // On envoie le move ET le pool de dés à l'adversaire
      socket.emit("send_move", {
        roomId: roomActuelle,
        senderId: socket.id,
        actionType: "attack",
        detail: move,
        randomPool: randomPool, // 🆕 Ajouté au payload
      });

      // On exécute chez nous avec notre pool
      await executeAttackAction(move, "user", randomPool);
    } else {
      await executeAttackAction(move, "user");
    }
  }

  // MOTEUR DE RÉSOLUTION (Exécute les calculs et animations de statut)
  async function executeAttackAction(
    move: PokeBattlePokemonMove,
    attackerSide: "user" | "enemy",
    receivedRandomPool?: number[],
  ) {
    const isUserAttacking = attackerSide === "user";
    const attackerTeam = isUserAttacking ? userPokemons : enemyPokemons;
    const defenderTeam = isUserAttacking ? enemyPokemons : userPokemons;
    const activeAttacker = getActivePokemon(attackerTeam);
    const activeDefender = getActivePokemon(defenderTeam);

    const poolCopy = receivedRandomPool ? [...receivedRandomPool] : [];
    const rollDice = () => {
      if (poolCopy.length > 0) {
        return poolCopy.shift()!; // Pioche le premier nombre du pool partagé
      }
      return Math.random();
    };

    try {
      setIsActionPending(true);

      // Vérification de la recharge
      if (await isRecharging(activeAttacker, attackerSide)) return;

      // Lancement de l'attaque si possible
      if (
        await canPokemonAttack(activeAttacker, move, attackerSide, rollDice)
      ) {
        await attackResolution(
          activeAttacker,
          activeDefender,
          move,
          attackerSide,
          rollDice,
        );
      }

      // Application des altérations de statut de fin de tour
      if (activeAttacker.isBurnt) {
        await applyBurnDamage(activeAttacker, attackerSide);
      }
      if (activeAttacker.isPoisoned) {
        await applyPoisonDamage(activeAttacker, attackerSide);
      }
      if (activeAttacker.isSeeded) {
        await applyLeechSeed(activeAttacker, activeDefender, attackerSide);
      }
    } finally {
      setIsActionPending(false);

      // 🌐 ORIENTATION DES TOURS ET INTERMISSION (PvE & PvP)
      if (battleMode === "pvp") {
        // Si c'est moi qui ai attaqué ("user"), la cible (targetTeam) est l'ennemi ("enemy")
        // Si c'est l'adversaire qui a attaqué ("enemy"), la cible est mon équipe ("user")
        setTargetTeam(isUserAttacking ? "enemy" : "user");
      } else {
        // Mode Solo classique
        setTargetTeam("enemy");
      }

      // On envoie TOUJOURS le jeu en intermission pour vérifier les statuts et les K.O.
      setGameStatus("intermission");
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
    const updateTeam =
      attackerTeam === "user" ? setUserPokemons : setEnemyPokemons;
    updateTeam((prev) => {
      return prev.map((poke) => {
        if (poke.id === attacker.id && poke.isConfused) {
          setTextBox(`${attacker.name} se blesse dans sa confusion !`);
          setSound({ type: "normal", trigger: Date.now() });
          return {
            ...poke,
            currentHp: attackerRemainingHp,
          };
        }
        return poke;
      });
    });
    await sleep(1500);
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
    rollDice: () => number,
  ): Promise<boolean> {
    if (await isFlinch(attacker, attackerTeam)) return false;
    if (await isSleeping(attacker, attackerTeam)) return false;
    if (await isFrozen(attacker, move, attackerTeam, rollDice)) return false;
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

  async function isParalyze(
    attacker: PokeBattlePokemonDetails,
    rollDice: () => number,
  ) {
    if (attacker.isParalyze && rollDice() * 100 <= 25) {
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
    rollDice: () => number,
  ) {
    if (!attacker.isFrozen) return false;
    const iceMelts = rollDice() * 100 <= 20;
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
    rollDice: () => number,
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
    if (attacker.isConfused && rollDice() < 1 / 3) {
      await applyConfusionDamage(attacker, attackerTeam);
      return;
    }

    if (attacker.isParalyze && (await isParalyze(attacker, rollDice)) === true)
      return;

    if (move.category === "status") {
      await applyStatus(attacker, defender, move, attackerTeam, rollDice);
      return;
    }

    await applyDamage(attacker, defender, move, attackerTeam, rollDice);
  }

  async function applyStatus(
    attacker: PokeBattlePokemonDetails,
    defender: PokeBattlePokemonDetails,
    move: PokeBattlePokemonMove,
    attackerTeam: "user" | "enemy",
    rollDice: () => number,
  ) {
    const isAttackSuccess = await attackSuccess(
      attacker,
      defender,
      move,
      rollDice,
    );
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
    const applyStatus = rollDice() * 100 <= statusChance;

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
        const sleepTurns = Math.floor(rollDice() * 3) + 1;
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
        const randomTurns = Math.floor(rollDice() * 4) + 2;
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
    rollDice: () => number,
  ) {
    const isAttackSuccess = await attackSuccess(
      attacker,
      defender,
      move,
      rollDice,
    );
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
        const totalHits = determineHitCount(move, rollDice);

        let currentHp = defender.currentHp;
        let actualHits = 0;

        for (let i = 0; i < totalHits; i++) {
          // Vérification de K.O. avant d'attaquer
          if (currentHp <= 0) break;

          const isCrit = checkIsCritical(move || 0, rollDice);
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
            if (rollDice() * 100 <= move.flinchChance) {
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
        const isCrit = checkIsCritical(move || 0, rollDice);
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
        shouldApplyParalysis = rollDice() * 100 <= paralyzeChance;
      }

      // Gestion de l'endormissement
      let shouldApplySleep = false;
      let sleepTurns = 0;
      if (move.status === "sleep" && !defender.isAsleep && canApplyStatus) {
        const sleepChance = move.statusChance === 0 ? 100 : move.statusChance;
        shouldApplySleep = rollDice() * 100 <= sleepChance;
        if (shouldApplySleep) {
          sleepTurns = Math.floor(rollDice() * 3) + 1;
        }
      }

      // Gestion du gel
      let shouldApplyFreeze = false;
      if (move.status === "freeze" && !defender.isFrozen && canApplyStatus) {
        const freezeChance = move.statusChance === 0 ? 100 : move.statusChance;
        shouldApplyFreeze = rollDice() * 100 <= freezeChance;
      }

      // Gestion de la brulure
      let shouldApplyBurn = false;
      if (move.status === "burn" && !defender.isBurnt && canApplyStatus) {
        const burnChance = move.statusChance === 0 ? 100 : move.statusChance;
        shouldApplyBurn = rollDice() * 100 <= burnChance;
      }

      // Gestion du poison
      let shouldApplyPoison = false;
      if (move.status === "poison" && !defender.isPoisoned && canApplyStatus) {
        const poisonChance = move.statusChance === 0 ? 100 : move.statusChance;
        shouldApplyPoison = rollDice() * 100 <= poisonChance;
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
        shouldApplyConfusion = rollDice() * 100 <= confusionChance;
        if (shouldApplyConfusion) {
          confusionTurns = Math.floor(rollDice() * 4) + 2;
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
        shouldApplyLeechSeed = rollDice() * 100 <= leechSeedChance;
      }

      // Gestion de flinch (Seulement pour les attaques monocoups, les multi-hits sont gérés dans la boucle)
      if (
        !isMultiHit &&
        move.flinchChance > 0 &&
        !defender.isFlinch &&
        canApplyStatus
      ) {
        shouldApplyFlinch = rollDice() * 100 <= move.flinchChance;
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
    updateAttackerTeam((prev) =>
      prev.map((poke) =>
        poke.id === defender.id ? { ...poke, isRecharging: true } : poke,
      ),
    );
    await sleep(100);
  }

  function determineHitCount(
    move: PokeBattlePokemonMove,
    rollDice: () => number,
  ) {
    // Si l'attaque est fixe (ex: Double Pied = 2)
    if (move.minHits === move.maxHits) return move.minHits;

    // Probabilités officielles pour attaques 2-5 hits (Balle Graine, etc.)
    if (move.minHits === 2 && move.maxHits === 5) {
      const rand = rollDice();
      if (rand < 0.375) return 2; // 37.5%
      if (rand < 0.75) return 3; // 37.5%
      if (rand < 0.875) return 4; // 12.5%
      return 5; // 12.5%
    }

    // Fallback pour des cas personnalisés (ex: 2-3 hits)
    return (
      Math.floor(rollDice() * (move.maxHits - move.minHits + 1)) + move.minHits
    );
  }

  function checkIsCritical(
    move: PokeBattlePokemonMove,
    rollDice: () => number,
  ): boolean {
    // Ici, on part du principe que l'étage de base est le crit_rate du move.
    // Tu pourras y ajouter +1 ou +2 plus tard si tu implémentes les objets/talents.

    const rand = rollDice();
    if (move.critRate === 0) return rand < 1 / 24; // ~4.17%
    if (move.critRate === 1) return rand < 1 / 8; // 12.5%
    if (move.critRate === 2) return rand < 1 / 2; // 50%
    return true;
  }

  async function attackSuccess(
    attacker: PokeBattlePokemonDetails,
    defender: PokeBattlePokemonDetails,
    move: PokeBattlePokemonMove,
    rollDice: () => number,
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
      applyAttack = rollDice() * 100 <= finalAccuracy;
    }

    if (!applyAttack) {
      setTextBox(`Mais cela échoue !`);
      await sleep(1500);
    }
    return applyAttack;
  }

  async function startGame(trainer?: PokeBattleTrainer) {
    setIsDrafting(true);
    const draftedTeam = (await draftTeam()) as PokeBattlePokemonDetails[];
    setIsDrafting(false);
    await sleep(100);
    setIsFetching(true);
    setUserPokemons(draftedTeam);
    setUserScore(calculatePokemonTeamPower(draftedTeam));
    setUserObjects(POKEBATTLE_OBJECTS);
    if (battleMode === "tower") {
      setPokemonStatsBeforeMatch(draftedTeam.map((pokemon) => pokemon.stats));
      setFloor(1);
      setTowerBuff([]);
      await loadTowerFloor(1);
    } else {
      const nbPokemon = 6;
      const enemyTeam = trainer?.pokemons
        ? await getPokemonTeam(nbPokemon, trainer.pokemons)
        : await getPokemonTeam(nbPokemon);

      trainer !== undefined ? setTrainer(trainer) : setTrainer(null);
      setEnemyScore(calculatePokemonTeamPower(enemyTeam));
      setEnemyObjects(POKEBATTLE_OBJECTS);
      setEnemyPokemons(enemyTeam);
    }

    setIsFetching(false);
    setGameStatus("presentation");
  }

  async function startBattle(socketId?: string, opponentSocketId?: string) {
    const activeUser = userPokemons[0];
    const activeEnemy = enemyPokemons[0];

    let isMyPokemonFaster = activeUser.stats.speed > activeEnemy.stats.speed;

    // Gestion des égalités parfaites de vitesse en PvP
    if (activeUser.stats.speed === activeEnemy.stats.speed) {
      if (battleMode === "pvp" && socketId && opponentSocketId) {
        // Le joueur qui a le socket ID le plus petit alphabétiquement commence
        isMyPokemonFaster = socketId < opponentSocketId;
      } else {
        // En PvE, le joueur humain garde la priorité
        isMyPokemonFaster = true;
      }
    }

    if (isMyPokemonFaster) {
      setGameStatus("user_turn");
      setTargetTeam("enemy");
      setTextBox(`Que doit faire ${activeUser.name} ?`);
    } else {
      setGameStatus("enemy_turn");
      setTargetTeam("user");
      setTextBox(`C'est au tour de l'adversaire...`);
    }
  }

  async function preparePvPBattle(activeSocket: Socket, roomId: string) {
    setTrainer(null);
    setIsDrafting(true);
    setUserPokemons([]);
    setEnemyPokemons([]);

    try {
      const draftedTeam = (await draftTeam()) as PokeBattlePokemonDetails[];
      setDraftChoices([]);
      // Enregistrement de l'équipe complète
      setUserPokemons(draftedTeam);
      setUserObjects(POKEBATTLE_OBJECTS);
      setUserScore(calculatePokemonTeamPower(draftedTeam));

      const cleanRoomId =
        typeof roomId === "object" ? (roomId as any).roomId : roomId;

      activeSocket.emit("share_team", cleanRoomId, draftedTeam);
    } catch (error) {
      console.error("Erreur lors de la génération de la draft PvP :", error);
    }
  }

  async function draftTeam() {
    try {
      const draftedTeam: PokeBattlePokemonDetails[] = [];
      const draftIds: number[] = [];
      const nbRound = battleMode === "tower" ? 3 : 6;
      // Boucle de draft : 6 rounds pour obtenir 6 Pokémon
      for (let round = 1; round <= nbRound; round++) {
        setIsFetching(true);
        // 1. Génération de 3 IDs aléatoires uniques (Ex: Génération 1 à 1025)
        const randomIds: number[] = [];
        while (randomIds.length < 3) {
          const id = getRandomNumber(1, 1025);
          if (!randomIds.includes(id) && !draftIds.includes(id)) {
            randomIds.push(id);
          }
        }

        // Fetch des détails des 3 Pokémon en parallèle
        const detailsPromises = randomIds.map((id) => getPokemonDetails(id));
        const fetchedChoices = await Promise.all(detailsPromises);

        // Filtrage des éventuels échecs de l'API
        const validChoices = fetchedChoices.filter(
          (p) => p !== null,
        ) as PokeBattlePokemonDetails[];
        setDraftChoices(validChoices);
        setIsFetching(false);

        // On met la boucle en pause tant que le joueur n'a pas cliqué
        const selectedPokemon: PokeBattlePokemonDetails =
          await new Promise<any>((resolve) => {
            nextRoundResolver.current = resolve;
          });

        // On ajoute le Pokémon choisi à l'équipe locale
        draftedTeam.push(selectedPokemon);
        setUserPokemons([...draftedTeam]);
        draftIds.push(selectedPokemon.id);
      }

      return draftedTeam;
    } catch (error) {
      console.error("Erreur lors de la génération de la draft PvP :", error);
    }
  }

  async function goToWaitingScreen() {
    if (socket && roomActuelle) {
      socket.emit("leave_room", roomActuelle);
    }

    // Reset des flags de combat/revanche
    setOpponentForfait(false);
    setRematchProposed(false);
    setOpponentWantsRematch(false);

    // Reset des données de la session passée
    setOpponentSocketId(null);
    setRoomActuelle("");
    setEnemyPokemons([]);
    setUserPokemons([]);
    setBattleMode("pve");

    // Retour au menu
    setGameStatus("waiting");
  }

  function handleRequestRematch() {
    if (socket && roomActuelle) {
      setRematchProposed(true);
      socket.emit("request_rematch", roomActuelle);
    }
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

  async function loadTowerFloor(nextFloor: number) {
    setIsFetching(true);
    setFloor(nextFloor);

    // Progression de l'intelligence de l'IA (Max à 1.0 vers l'étage 20)
    const intelligence = Math.min(0.05 + nextFloor * 0.05, 1.0);

    // Application de tes paramètres de puissance
    const teamSize = 3;
    const totalTargetPower = 650 + (nextFloor - 1) * 50; // Étage 1 = 650, Étage 2 = 690...
    const targetPowerPerPokemon = totalTargetPower / teamSize; // Puissance équitablement répartie

    const newTeam: PokeBattlePokemonDetails[] = [];
    const pokemonIds: number[] = [];

    // Pioche et mise à l'échelle (Scaling) des 3 Pokémon
    for (let i = 0; i < teamSize; i++) {
      const randomId = Math.floor(Math.random() * 1025) + 1;
      pokemonIds.push(randomId);

      const pokemon = await getPokemonDetails(randomId);

      if (pokemon) {
        // Calcul de la puissance brute du Pokémon généré (via PokéAPI)
        const rawPokemonPower = calculatePokemonPower(pokemon);

        // Calcul du ratio d'ajustement unique pour ce Pokémon
        const scalingRatio = targetPowerPerPokemon / rawPokemonPower;

        // Mutation des statistiques selon le ratio de l'étage
        const scaledStats = {
          hp: Math.round(pokemon.stats.hp * scalingRatio),
          attack: Math.round(pokemon.stats.attack * scalingRatio),
          defense: Math.round(pokemon.stats.defense * scalingRatio),
          "special-attack": Math.round(
            pokemon.stats["special-attack"] * scalingRatio,
          ),
          "special-defense": Math.round(
            pokemon.stats["special-defense"] * scalingRatio,
          ),
          speed: Math.round(pokemon.stats.speed * scalingRatio),
          accuracy: pokemon.stats.accuracy,
          evasion: pokemon.stats.evasion,
        };

        // Sécurité pour éviter qu'un Pokémon se retrouve avec 0 PV
        if (scaledStats.hp < 10) scaledStats.hp = 10;

        newTeam.push({
          ...pokemon,
          stats: scaledStats,
          currentHp: scaledStats.hp,
        });
      }
    }

    // Calcul de la puissance réelle finale du groupe
    const totalTeamPower = calculatePokemonTeamPower(newTeam);
    const randomNumber = getRandomNumber(1, BATTLE_MUSIC.length);
    const battleMusic = BATTLE_MUSIC[randomNumber];
    const victoryMusic = VICTORY_MUSIC[randomNumber];
    setIsFetching(false);
    setTrainer({
      name: `Dresseur Étage ${nextFloor}`,
      pokemons: pokemonIds,
      battleAudioSrc: battleMusic,
      victoryAudioSrc: victoryMusic,
      img: `https://play.pokemonshowdown.com/sprites/trainers/aaron.png`,
      power: totalTeamPower,
      gen: "Tour de combat",
      intelligence: intelligence,
    });

    setEnemyPokemons(newTeam);
    setEnemyScore(totalTeamPower);

    // Distribution des objets de l'IA pour le match
    const updatedEnemyObjects = POKEBATTLE_OBJECTS.map((obj) => {
      let quantity = 0;
      if (obj.type === "heal" && nextFloor >= 5) quantity = 1;
      if (obj.type === "status" && nextFloor >= 10) quantity = 1;
      if (obj.type === "reborn" && nextFloor >= 15) quantity = 1;

      return { ...obj, quantity };
    });
    setEnemyObjects(updatedEnemyObjects);
  }

  return (
    <PokeBattleContext.Provider
      value={{
        gameStatus,
        leaderboard,
        isActionPending,
        isAttacking,
        isFetching,
        userScore,
        enemyScore,
        userPokemons,
        enemyPokemons,
        enemyObjects,
        userObjects,
        sound,
        types,
        textBox,
        trainer,
        battleMode,
        socket,
        opponentSocketId,
        roomActuelle,
        opponentForfait,
        rematchProposed,
        opponentWantsRematch,
        isDrafting,
        nextRoundResolver,
        draftChoices,
        towerPoint,
        floor,
        towerBuff,
        setTowerBuff,
        setPokemonStatsBeforeMatch,
        setUserObjects,
        setUserPokemons,
        loadTowerFloor,
        setFloor,
        setTowerPoint,
        setBattleMode,
        setRoomActuelle,
        startGame,
        addToLeaderboard,
        updateLeaderboard,
        setEnemyPokemons,
        setGameStatus,
        startBattle,
        setEnemyScore,
        setSocket,
        setOpponentSocketId,
        preparePvPBattle,
        handleRequestRematch,
        goToWaitingScreen,
        handleUserAttack,
        handleUserSwitch,
        handleUserObjectUse,
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
