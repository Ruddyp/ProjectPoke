import mongoose, { Schema } from "mongoose";

export interface IPokeBatlle {
  _id: string;
  name: string;
  score: number;
  difficulty: string;
}

const pokeBattleLeaderboardSchema = new Schema<IPokeBatlle>({
  name: { type: String, required: true },
  score: { type: Number, required: true },
  difficulty: { type: String, required: true },
});

export const PokeBattleLeaderboard =
  mongoose.models.pokebattle_leaderboards ||
  mongoose.model("pokebattle_leaderboards", pokeBattleLeaderboardSchema);
