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

	toObject():any{
        return {email:this.email,
			type: this.type
        };
    }

}

export class IndModel {
	first_name = '';
	last_name = '';

	public constructor(fname:string, lname:string) {
		this.first_name = fname;
		this.last_name = lname;
	}
	toObject():any{
        return {first_name:this.first_name,
            last_name:this.last_name
        };
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

	public constructor(bname:string, cname:string, cphone:string, cemail:string, baddr:string) {
		this.bus_name = bname;
		this.contact_name = cname;
		this.contact_phone = cphone;
		this.contact_email = cemail;
		//this.geoloc = geoloc;
		this.bus_address = baddr;
	}

	toObject():any{
        return {name:this.bus_name,
            contact_name:this.contact_name,
            contact_phone:this.contact_phone,
            contact_email:this.contact_email,
            //geolocation:this.geoloc,
            mailAddress:this.bus_address,
            hostedEvents:this.hosted_events};
    }
}

export class Geoloc {
	lng:number;
	lat:number;

	public constructor(lng:number, lat:number) {
		this.lat = 0.0;
		this.lng = 0.0;
	}
	toObject():any{
        return {lat:this.lat,
            lng:this.lng
        };
	}
	
}

export class Event{
    title='';
    bus_id='';
    description?='';
    registered_ind:string[]=[];
    event_geoloc='';
    event_address=new Geoloc(0,0);
    start_time='';
    end_time='';
    create_date='';
	
	public constructor(title:string, description:string, event_address:Geoloc, start_time:string, end_time:string) {
		this.title = title;
		this.description = description;
		this.event_address = event_address;
		this.start_time = start_time;
		this.end_time = end_time;
	}
    toObject():any{
        return {title:this.title,bus_id:this.bus_id,description:this.description,registered_ind:this.registered_ind,event_geoloc:this.event_geoloc,event_address:this.event_address,start_time:this.start_time,end_time:this.end_time};
    }
}