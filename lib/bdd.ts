"use server";

import { connectDB } from "@/lib/connexion";
import { IMemoryLeaderboard, MemoryLeaderboard } from "@/models/leaderboard";
import { revalidatePath } from "next/cache";

export async function getLeaderboard() {
  try {
    await connectDB();
    const data: IMemoryLeaderboard[] = await MemoryLeaderboard.find()
      .sort({
        score: 1,
        time: 1,
      })
      .lean();
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Erreur DB:", error);
    return [];
  }
}

export async function replaceScoreLeaderboard(
  idToUpdate: string,
  scoreToPush: Partial<IMemoryLeaderboard>,
): Promise<IMemoryLeaderboard> {
  try {
    await connectDB();

    // { new: true } permet de récupérer le document APRES la modification
    // .lean() pour renvoyer un objet JS
    const updatedScore = await MemoryLeaderboard.findByIdAndUpdate(
      idToUpdate,
      { $set: scoreToPush },
      { new: true, runValidators: true },
    ).lean();

    if (!updatedScore) {
      throw new Error("Score non trouvé");
    }

    // On convertit l'ID en string avant de renvoyer pour éviter les erreurs de sérialisation
    const result = {
      ...updatedScore,
      _id: updatedScore._id.toString(),
    };

    // Forcer la revalidation du cache pour le chemin correct
    revalidatePath("/games/memory"); // Chemin mis à jour
    return result;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du leaderboard:", error);
    throw new Error("Impossible de mettre à jour le score.");
  }
}

export async function addScoreToLeaderboard(
  scoreData: Partial<IMemoryLeaderboard>,
): Promise<IMemoryLeaderboard> {
  try {
    await connectDB();

    const newEntry = await MemoryLeaderboard.create(scoreData);

    // On convertit l'ID en string avant de renvoyer pour éviter les erreurs de sérialisation
    const result = {
      ...newEntry.toObject(),
      _id: newEntry._id.toString(),
    };
    // Forcer la revalidation du cache pour le chemin correct

    revalidatePath("/games/memory"); // Chemin mis à jour
    return result;
  } catch (error) {
    console.error("Erreur lors de l'ajout du score:", error);
    throw new Error("Impossible de mettre à jour le score.");
  }
}
