//import { Config } from './Config';

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
	zip:number;
	geoloc:Geoloc;

	public constructor(fname:string, lname:string, zip:number=0, geoloc:Geoloc=new Geoloc(0, 0)) {
		this.first_name = fname;
		this.last_name = lname;
		this.geoloc = geoloc;
		this.zip = zip;
	}
	toObject():any{
        return {first_name:this.first_name,
			last_name:this.last_name,
			zip:this.zip,
			geoloc:this.geoloc
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

export class EventModel{
	_id='';
    title='';
    bus_id='';
    description?='';
    registered_ind:string[]=[];
    event_geoloc:Geoloc = new Geoloc(0, 0);
    event_address='';
	start_time:Date;
	cust_str_start_time:string;
	end_time:Date;
	cust_str_end_time:string;
	create_date:Date|null = null;
	registered:boolean;
	inProgress:boolean = false;
	completed:boolean = false;
	actual_bus_id:string='';
	actual_address:string='';

	
	public constructor(title:string, description:string, event_address:string, start_time:Date, end_time:Date, _id:string='', bus_id:string='', registered_ind:string[]=[], geoloc:Geoloc = new Geoloc(0, 0), create_date:Date=null, registered:boolean=false, cust_str_start:string='', cust_str_end:string='', actual_bus_id: string='', actual_address: string=''){
		this._id = _id;
		this.title = title;
		this.bus_id = bus_id;
		this.description = description;
		this.event_address = event_address;
		this.registered_ind = registered_ind;
		this.start_time = start_time;
		this.end_time = end_time;
		this.event_geoloc = geoloc;
		this.registered_ind = registered_ind;
		this.create_date = create_date;
		this.registered = registered;
		this.cust_str_start_time = cust_str_start;
		this.cust_str_end_time = cust_str_end;
		let now = new Date(Date.now());
		if (this.start_time < now && this.end_time > now) this.inProgress = true;
		if (this.end_time < now) this.completed = true;
		this.actual_bus_id = actual_bus_id;
		this.actual_address = actual_address;
	}
    toObject():any{
		return {
			_id:this._id,
			title:this.title,
			bus_id:this.bus_id,
			description:this.description,
			registered_ind:this.registered_ind,
			event_geoloc:this.event_geoloc,
			event_address:this.event_address,
			start_time:this.start_time,
			end_time:this.end_time,
			create_date:this.create_date
		};
    }
}