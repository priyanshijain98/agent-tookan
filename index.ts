import {
    TOOKAN_API_KEY,TASKS
} from "../constants";
import {firestoreInstance} from "../index";
import * as Tookan from "tookan-api";
const client = new Tookan.Client({api_key: TOOKAN_API_KEY});

export async function createTookanTask(snapshot, context) {
    
    const taskId = context.params.taskId;
    const newValue = snapshot.data();
    

    console.log('Triggering Create Tookan task for task id ', taskId, newValue);

    const options = {
        api_key:TOOKAN_API_KEY,
        order_id:newValue.order_id,
        job_description:newValue.job_description,
        customer_email:newValue.customer_email,
        customer_username:newValue.customer_username,
        customer_phone:newValue.customer_phone,
        customer_address:newValue.customer_address,
        latitude:newValue.latitude,
        longitude:newValue.longitude,
        job_delivery_datetime:newValue.job_delivery_datetime,
        custom_field_template:newValue.custom_field_template,
        meta_data:newValue.pickup_meta_data,
        team_id:newValue.team_id,
        auto_assignment:newValue.auto_assignment,
        has_pickup:newValue.has_pickup,
        has_delivery:newValue.has_delivery,
        layout_type:newValue.layout_type,
        tracking_link:newValue.tracking_link,
        timezone:newValue.timezone,
        fleet_id:newValue.fleet_id,
        ref_images:newValue.p_ref_images,
        notify:newValue.notify,
        tags:newValue.tags,
        geofence:newValue.geofencing
    };
    //Create task in tookan
    console.log('Creating tookan task for options: ', options);
    return client.createTask(options).then(res => {
        return updateTaskOnTaskCreate(res,taskId);   
    })
    .catch(err => {
        console.log("Tookan Create task failed: " + err)
    });
}

async function updateTaskOnTaskCreate (res,taskId): Promise<string> {
    console.log("Tookan task created with response successfully for taskId: ",taskId,"Response received from tookan: ",res);
    console.log("Update Task based on response for taskId started",taskId);
    console.log("Updated content for task_id ",taskId,"content: ",res.data);
    const taskRef = firestoreInstance.collection(TASKS).doc(taskId);
    taskRef.set(res.data).then(() => console.log("task updated based on tookan response for taskId:", taskId)).catch(err => console.log("Update task based on task id failed for: " + err));
	return taskId
}

