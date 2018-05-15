export interface Opportunity {

	_id?: string;
	enabled: boolean;

	readonly actionCost: number;
	readonly moneyCost: number;

	readonly commCost: number;
	readonly jobCost: number;
	readonly englishCost: number;

	readonly locationUnlocks: string[];
	readonly actionReward: number;
	readonly moneyReward: number;
	readonly commReward: number;
	readonly jobReward: number;
	readonly englishReward: number;

	readonly triggerAmt: number;
	readonly rewardFlavor: string;
	
	readonly description: string;
	readonly name: string;

	readonly effect: string;
	readonly effectTrigger: string;
	readonly effectWait: number;

	readonly givesTransit?: boolean;
	readonly givesJob?: boolean;
	readonly requiresTransit?: boolean;
	readonly requiresJob?: boolean;


}
