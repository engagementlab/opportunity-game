import { Opportunity } from './opportunity';

export interface GameLocation {

	_id?: string;
	readonly name: string;
	readonly intro: string;
	readonly description: string;
	readonly image: string;
	readonly key: string;
	readonly categories: object;
	readonly categoriesStr: string;

	readonly unlockedAtStart: boolean;
	enabled: boolean;
	
  opportunities: Opportunity[];

}
