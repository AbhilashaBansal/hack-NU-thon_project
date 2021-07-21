// add check to see if admin logged in

// initial loading of hospitals, wrap in fn
$("#doosra-div").hide();
let hosp_id;

function show_vac_appts_hosp(id) {
    $("#div_1_1").empty();
    let ele = $("#div_1_1");
    $.post('/get_hosp_vacs', {id}, (data, status)=>{
        console.log(data);
        if(status=="success"){
            console.log("here");
            $.each(data.data, function(index, item){
                console.log("inside");
                ele.append(
                    `<div style="margin: 1%; background: lavender; padding: 2%;">
                        <p>Email: ${item.email}</p>
                        <p>Date: ${item.appt_date}</p>
                        <p>Slot: ${item.appt_slot}</p>
                        <p>Status: ${item.status}</p>
                    </div>`
                );
                if(item.status=="Pending"){
                    ele.append(
                        `<button style="margin: 1%; type="button" class="btn btn-primary" id=${item.email.split("@")[0]}>Mark as Completed</button>`
                    );
                    let idstr = "#"+item.email.split("@")[0];
                    $(idstr).click(function(e){
                        e.preventDefault();
                        $.post('/complete_vac', {email: item.email}, (data, status)=>{
                            console.log(status, data);
                            if(status=="success"){
                                alert("Done!");
                                document.location.href = './admin_dashboard.html';
                            }
                            else{
                                alert("Some error occured!");
                            }
                        })
                    })
                }
            })
        }
    })
}

function show_bed_reqs_hosp(id) {
    $("#div_1_2").empty();
    let ele = $("#div_1_2");
    $.post('/get_bed_reqs', {id}, (data, status)=>{
        console.log(data);
        if(status=="success"){
            console.log("here");
            $.each(data.data, function(index, item){
                console.log("inside");
                ele.append(
                    `<div style="margin: 1%; background: lavender; padding: 2%;">
                        <p>Email: ${item.email}</p>
                        <p>Date: ${item.req_date}</p>
                        <p>Slot: ${item.symptoms}</p>
                        <p>Status: ${item.status}</p>
                    </div>`
                );
                if(item.status=="Pending"){
                    ele.append(
                        `<div style="margin: 1%; background: lavenderblush; padding: 2%;" class="form-group">
                            <label for="instructions">Instructions: </label>
                            <input type="text" class="form-control" id="${"instructions_" + item.id.toString()}" name="instructions">
                        </div>
                        <button type="button" style="margin: 1%;" class="btn btn-primary" id="${"bedreq"+item.id.toString()}">Mark as Approved</button>
                        <button type="button" style="margin: 1%;" class="btn btn-primary" id="${"bedreq_"+item.id.toString()}">Mark as Rejected</button>`
                    );
                    let idstr = "#bedreq"+item.id.toString();
                    console.log(idstr);
                    $(idstr).click(function(e){
                        let hid = id;
                        e.preventDefault();
                        let instructions = $("#instructions_"+item.id.toString()).val();
                        $.post('/complete_bed', {email: item.email, instructions, id: item.id, hosp_id: hid}, (data, status)=>{
                            console.log(status, data);
                            if(status=="success"){
                                alert("Done!");
                                document.location.href = './admin_dashboard.html';
                            }
                            else{
                                alert("Some error occured!");
                            }
                        })
                    })
                    let idstr2 = "#bedreq_"+item.id.toString();
                    console.log(idstr2);
                    $(idstr2).click(function(e){
                        e.preventDefault();
                        console.log("hello mate");
                        let st = "#instructions_"+item.id.toString();
                        console.log(st);
                        let instructions = $(st).val();
                        console.log(instructions);
                        $.post('/deny_bed', {email: item.email, instructions, id: item.id}, (data, status)=>{
                            console.log("in post req");
                            console.log(status, data);
                            if(status=="success"){
                                alert("Done!");
                                document.location.href = './admin_dashboard.html';
                            }
                            else{
                                alert("Some error occured!");
                            }
                        })
                    })
                }
                else{
                    ele.append(
                        `<div style="margin: 1%; background: lavenderblush; padding: 2%;">
                        <p>Instructions: ${item.instructions}</p>
                        </div>`
                    );
                    
                }
            })
        }
    })
}

function display_hospitals(){
    $('#hosp-list').empty();
    let hospital_data;
    async function getData(){
        await $.get('/show_hospitals', (data)=>{
            console.log("Hospitals Data: ", data);
            hospital_data = data;
        })
    }

    const str1 = '<div class="col-lg-3 col-md-5 col-sm-6 col-xs-12"> <div class="card"> <img class="card-img-top" src="./Image/hosp_icon.png" alt="Card image"> <div class="card-body"> <h5 class="card-title">';

    getData().then(()=>{
        $('#hosp-list').empty();
        for(let i=0; i<hospital_data.length; i++){
            console.log("here");
            $('#hosp-list').append(
                str1 + hospital_data[i].name + '</h5> <p class="card-text">Location: ' + hospital_data[i].locality + '</p>' +
                '<p class="card-text">State: ' + hospital_data[i].city + '</p>' +
                '<p class="card-text">Bed Count: ' + hospital_data[i].bed_count + '</p>' + 
                '<button type="button" id="' + hospital_data[i].id + '" class="view-hosp"> View More </button>' +
                '</div> </div>' 
            );

            let idstr = "#" + hospital_data[i].id;
            $(idstr).click(function(e){
                e.preventDefault();
                console.log(e.target);
                $("#pehla-div").hide();
                $("#doosra-div").show();

                // add information here
                $("#h1").text(hospital_data[i].name);
                $("#loc").text("Locality: " + hospital_data[i].locality);
                $("#state").text("State: " + hospital_data[i].city);
                $("#phone1").text("Phone: " + hospital_data[i].phone);
                $("#contact_person1").text("Contact Person: " + hospital_data[i].contact_person);
                $("#amb_phone1").text("Ambulance Phone No.: " + hospital_data[i].amb_phone);
                $(".hosp_id").val(hospital_data[i].id);
                hosp_id = hospital_data[i].id; // check
                // console.log(hospital_data[i].bed_count);
                $("#bed_cnt1").val(hospital_data[i].bed_count);
                show_vac_appts_hosp(hosp_id);
                show_bed_reqs_hosp(hosp_id);
            });
        }
    }).catch((err)=>{
        if (err) throw err;
    }) 
}

display_hospitals();


// add a hospital post req
$("#add-hosp-btn").click(function(e){
    e.preventDefault();

    let name = $("#name").val();
    let locality = $("#locality").val();
    let city = $("#city").val();
    let phone = $("#phone").val();
    let email = $("#email").val();
    let contact_person = $("#contact_person").val();
    let amb_phone = $("#amb_phone").val();
    let bed_cnt = $("#bed_cnt").val();

    // console.log(hospital_id, hospital_city);

    $.post('/add_hospital', {name, locality, city, phone, email, contact_person, amb_phone, bed_cnt}, function(data, status){
        console.log(status);
        console.log(data);
        if(status=="success"){
            alert("Hospital added successfully!");
            document.getElementById("add_hosp_form").reset();
        }
        else{
            alert("Some error occurred! Please try again.");
        }
    });
    
})


// hospital loading on click of button
$("#v-pills-hosps-tab").click(function(e){
    e.preventDefault();
    display_hospitals();
})


// event listeners to view hospital details
$("#go_back").click(function(e){
    e.preventDefault();
    $("#doosra-div").hide();
    $("#pehla-div").show();
});


// event listener to update slots and bed count
$("#add-slots-btn").click(function(e){
    e.preventDefault();
    
    let id = $("#hosp_id").val();
    let date = $("#date").val();

    // console.log(hospital_id, hospital_city);

    $.post('/add_slots', {id, date}, function(data, status){
        console.log(status);
        console.log(data);
        if(status=="success"){
            alert("Slots added successfully!");
        }
        else{
            alert("Some error occurred! Please try again.");
        }
    });
});

$("#bed-cnt-btn").click(function(e){
    e.preventDefault();
    
    let id = $("#hosp_id").val();
    let bed_cnt = $("#bed_cnt1").val();

    // console.log(hospital_id, hospital_city);

    $.post('/update_bed_cnt', {id, bed_cnt}, function(data, status){
        console.log(status);
        console.log(data);
        if(status=="success"){
            alert("Bed count updated successfully!");
            display_hospitals();
        }
        else{
            alert("Some error occurred! Please try again.");
        }
    });
});