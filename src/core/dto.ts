import { BigNumber } from "ethers";

export interface CreateProjectDTO {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    logoUrl: string;
    coverBackgroundUrl: string;
    maxAllocation: BigNumber;
    totalRaise: BigNumber;
    tokenSymbol: string;
    tokenSwapRaito: string;
    opensAt: number;
    endsAt: number;
    // idoStartsAt: number;
    // idoEndsAt: number;
}
