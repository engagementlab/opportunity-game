import { Character } from './character';

export interface PlayerData {

	round: number;
	money: number;
	actions: number;
	commLevel: number;
	jobLevel: number;
	englishLevel: number;
	character: Character;
  
  hasTransit?: boolean;
  hasJob?: boolean;
  
  wellnessScore?: number;
  
  // Internal flags
  newRound?: boolean;
  gotTransit?: boolean;
  gotJob?: boolean;

}
