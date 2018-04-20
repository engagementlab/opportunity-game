export interface Opportunity {

	_id?: string;

	readonly actionCost: number;
	readonly moneyCost: number;
	readonly commReward: number;
	readonly jobReward: number;
	readonly englishReward: number;
	
	readonly description: string;
	readonly name: string;
	readonly type: string;


}
