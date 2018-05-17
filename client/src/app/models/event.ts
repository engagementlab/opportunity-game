export interface Event {

	_id?: string; 

	readonly name: string;
	readonly type: string;
	readonly flavor: string;

	readonly actionCost: number;
	readonly moneyCost: number;
	readonly commReward: number;
	readonly jobReward: number;
	readonly englishReward: number;
	readonly actionReward: number;
	readonly moneyReward: number;

	triggerAmt: number;
	reward: object;
	available?: boolean;

}
