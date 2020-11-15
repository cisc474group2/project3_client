import { Config } from './Config';

export class UserModel {
	email = '';
	password = '';
	type = '';
	type_obj : IndModel | BusModel;

	public constructor(email:string, password:string, type:string, type_obj:IndModel | BusModel) {
		this.email = email;
		this.password = password;
		this.type = type;
		this.type_obj = type_obj;
	}

}

export class IndModel {
	first_name = '';
	last_name = '';

	public constructor(fname:string, lname:string) {
		this.first_name = fname;
		this.last_name = lname;
	}
}

export class BusModel {
	bus_name = '';
	contact_name = '';
	contact_phone = '';
	contact_email = '';
	geoloc : Geoloc;
	bus_address = '';
	hosted_events = [];

	public constructor(bname:string, cname:string, cphone:string, cemail:string, geoloc:Geoloc, baddr:string) {
		this.bus_name = bname;
		this.contact_name = cname;
		this.contact_phone = cphone;
		this.contact_email = cemail;
		this.geoloc = geoloc;
		this.bus_address = baddr;
	}
}

export class Geoloc {
	lng = 0.0;
	lat = 0.0;

	public constructor(address:string) {
		const getZipData = (async () => {
			const dynURL = Config.GOOGLE_GEOCODING
				.replace('outputFormat', 'json')
				.replace('<<ADDR>>', address)
				.replace('<<KEY>>', Config.GOOGLE_API);
            const response = await fetch(dynURL);
            const json = await response.json(); 
            return json});
		
		//this.lng = longitude;
		//this.lat = latitude;
	}
}