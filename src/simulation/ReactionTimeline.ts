import type {
  Reaction,
  ReactionPhase,
  ReactionState,
  ReactionKinetics,
  PhaseRange,
} from "./types";
import { simEventBus } from "./SimEventBus";

const PHASE_MAP: PhaseRange[] = [
  { phase: "init", range: [0, 0.05] },
  { phase: "early", range: [0.05, 0.25] },
  { phase: "active", range: [0.25, 0.7] },
  { phase: "decay", range: [0.7, 0.95] },
  { phase: "stable", range: [0.95, 1.0] },
];

const KINETICS_RATE: Record<ReactionKinetics, number> = {
  violent: 0.004,
  normal: 0.0015,
  slow: 0.0005,
  equilibrium: 0.001,
};

const KINETICS_DURATION: Record<ReactionKinetics, number> = {
  violent: 1500,
  normal: 3000,
  slow: 6000,
  equilibrium: 4000,
};

export function createReaction(
  id: string,
  equation: string,
  description: string,
  kinetics: ReactionKinetics = "normal"
): Reaction {
  return {
    id,
    progress: 0,
    duration: KINETICS_DURATION[kinetics],
    rate: KINETICS_RATE[kinetics],
    state: "idle",
    phases: [...PHASE_MAP],
    kinetics,
    equation,
    description,
  };
}

export function getReactionPhase(reaction: Reaction): ReactionPhase {
  for (const { phase, range } of reaction.phases) {
    if (reaction.progress >= range[0] && reaction.progress < range[1]) return phase;
  }
  return "stable";
}

export function getPhaseProgress(reaction: Reaction): number {
  for (const { phase, range } of reaction.phases) {
    if (reaction.progress >= range[0] && reaction.progress < range[1]) {
      return (reaction.progress - range[0]) / (range[1] - range[0]);
    }
  }
  return 1;
}

export function isReactionActive(reaction: Reaction): boolean {
  return reaction.state === "running" && reaction.progress < 1;
}

export class ReactionTimeline {
  reactions = new Map<string, Reaction>();

  add(reaction: Reaction): void {
    this.reactions.set(reaction.id, reaction);
  }

  start(reactionId: string): boolean {
    const r = this.reactions.get(reactionId);
    if (!r || r.state !== "idle") return false;
    r.state = "running";
    r.progress = 0;
    simEventBus.emit("REACTION_STARTED", { id: r.id, equation: r.equation });
    return true;
  }

  update(deltaTime: number): void {
    for (const [, r] of this.reactions) {
      if (r.state !== "running") continue;

      const dt = deltaTime / r.duration;
      let increment = dt * r.rate * 60;

      switch (r.kinetics) {
        case "violent":
          if (r.progress < 0.5) {
            increment *= 1 + (0.5 - r.progress) * 4;
          }
          break;
        case "equilibrium":
          if (r.progress > 0.6 && r.progress < 0.9) {
            increment *= 0.3 + Math.sin(r.progress * Math.PI * 6) * 0.2;
          }
          break;
        case "slow":
          increment *= 0.8 + Math.sin(r.progress * Math.PI * 2) * 0.2;
          break;
      }

      r.progress = Math.min(1, r.progress + increment);

      simEventBus.emit("REACTION_PROGRESS", {
        id: r.id,
        progress: r.progress,
        phase: getReactionPhase(r),
      });

      if (r.progress >= 1) {
        r.state = "finished";
        simEventBus.emit("REACTION_FINISHED", { id: r.id, equation: r.equation });
      }
    }
  }

  get(id: string): Reaction | undefined {
    return this.reactions.get(id);
  }

  getActive(): Reaction[] {
    return Array.from(this.reactions.values()).filter((r) => r.state === "running");
  }

  getAll(): Reaction[] {
    return Array.from(this.reactions.values());
  }

  has(id: string): boolean {
    return this.reactions.has(id);
  }

  reset(): void {
    this.reactions.clear();
  }
}
