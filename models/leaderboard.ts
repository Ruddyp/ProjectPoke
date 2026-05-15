import mongoose, { Schema } from "mongoose";

export interface IMemoryLeaderboard {
  _id: string;
  name: string;
  time: number;
  score: number;
  difficulty: string;
}

const memoryLeaderboardSchema = new Schema<IMemoryLeaderboard>({
  name: { type: String, required: true },
  time: { type: Number, required: true },
  score: { type: Number, required: true },
  difficulty: { type: String, required: true },
});

export const MemoryLeaderboard =
  mongoose.models.memory_leaderboards ||
  mongoose.model("memory_leaderboards", memoryLeaderboardSchema);
