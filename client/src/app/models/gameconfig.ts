export interface GameConfig {

	_id?: string; 

	readonly startingMoney: number;
	readonly startingActions: number;
	readonly paydayMoney: number;
	readonly paydayWaitActions: number;
	readonly wellnessGoal: number;
	readonly surveyUrl: string;

}
