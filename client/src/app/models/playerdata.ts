import { Character } from './character';

export interface PlayerData {

	round: number;
	money: number;
	actions: number;
	commLevel: number;
	jobLevel: number;
	englishLevel: number;
	character: Character;
  
  wellnessScore?: number;
  newRound?: boolean;

}
