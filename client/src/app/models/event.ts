export interface Event {

	_id?: string; 

	readonly name: string;
	readonly flavor: string;

	readonly actionCost: number;
	readonly moneyCost: number;

}
