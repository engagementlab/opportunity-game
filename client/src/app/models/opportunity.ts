export interface Opportunity {

	_id?: string;
	enabled: boolean;

	readonly actionCost: number;
	readonly moneyCost: number;
	readonly commReward: number;
	readonly jobReward: number;
	readonly englishReward: number;
	
	readonly description: string;
	readonly name: string;
	readonly type: string;

	readonly effect: string;
	readonly effectTrigger: string;
	readonly effectWait: number;

	readonly givesTransit?: boolean;
	readonly givesJob?: boolean;


}
