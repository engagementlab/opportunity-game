import { Service } from './service';

export interface Location {

	_id?: string;
	readonly name: string;
	readonly intro: string;
	readonly description: string;
	readonly imageName: string;
	readonly url: string;
	
  services: Service[];

}
