let user_email;
let slot_map = {
    1: "8-9 AM", 2: "9-10 AM", 3: "10-11 AM", 4: "11-12 AM", 5: "12-1 PM", 6: "1-2 PM", 7: "2-3 PM", 8: "3-4 PM", 9: "4-5 PM", 10: "5-6 PM", 11: "6-7 PM", 12: "7-8 PM"
}

$.get('/user_email', (data, status)=>{
    user_email = data.user_email;
})

let user_vac_ap;
let user_bed_req;
let user_data;
async function get_user_det(){
    await $.get('/get_user_beds', (data)=>{
        console.log(data);
        user_bed_req = data;
    })
    await $.get('/get_user_vacs', (data)=>{
        console.log(data);
        user_vac_ap = data;
    })
    await $.get('/get_user_details', (data)=>{
        console.log(data);
        user_data = data;
    })
}

get_user_det().then(()=>{
    $("#pdiv_1").empty();
    $("#pdiv_1").append(
        `<p>Name: ${user_data.name}</p>
        <p>DOB: ${user_data.dob}</p>
        <p>City: ${user_data.city}</p>
        <p>Aadhaar No.: ${user_data.aadhaar}</p>
        <p>Phone: ${user_data.phone}</p>
        <p>Email: ${user_data.email}</p>`
    )
    if(user_vac_ap.found){
        $("#pdiv_2").empty();
        $("#pdiv_2").append(
            `<p>Appointment Date: ${user_vac_ap.d1.appt_date}</p>
            <p>Slot: ${slot_map[user_vac_ap.d1.appt_slot]}</p>
            <p>Hospital Name: ${user_vac_ap.d2.name}</p>
            <p>Hospital Locality: ${user_vac_ap.d2.locality}</p>
            <p>Hospital State: ${user_vac_ap.d2.city}</p>
            <p>Status: ${user_vac_ap.d1.status}</p>`
        )
    }
    if(user_bed_req.found){
        $("#pdiv_3").empty();
        $("#pdiv_3").append(
            `<p>Request Date: ${user_bed_req.d1.req_date}</p>
            <p>Symptoms: ${user_bed_req.d1.symptoms}</p>
            <p>Hospital Name: ${user_bed_req.d2.name}</p>
            <p>Hospital Locality: ${user_bed_req.d2.locality}</p>
            <p>Hospital State: ${user_bed_req.d2.city}</p>
            <p>Status: ${user_bed_req.d1.status}</p>`
        )
        if(user_bed_req.d1.status=="Pending"){
            // create button for deletion & add event listener
            $("#pdiv_3").append(
                `<button type="button" class="btn btn-primary" id="del_bed_req_btn">Delete Request</button>`
            )
            $("#del_bed_req_btn").click(function(e){
                e.preventDefault();
                let hospital_id = user_bed_req.d1.hospital_id;
                $.post('/delete_bed_req' ,{user_email, hospital_id}, (data, status)=>{
                    console.log(status);
                    console.log(data);
                    if(status=="success"){
                        alert("Request deleted!");
                        document.location.href = './dashboard.html';
                    }
                    else{
                        alert("Some error occurred! Please try again.");
                    }
                })
            })

        }   
        else{
            $("#pdiv_3").append(
                `<p>Instructions: ${user_bed_req.d1.instructions}</p>`
            )
        }
    }

})
.catch((err)=>{
    if (err) throw err;
})

function display_hospitals(){
    $('#hosp-list-1').empty();
    $('#hosp-list-2').empty();
    let hospital_data;
    async function getData(){
        await $.get('/show_hospitals', (data)=>{
            console.log("Hospitals Data: ", data);
            hospital_data = data;
        })
    }

    const str1 = '<div class="col-lg-3 col-md-5 col-sm-6 col-xs-12"> <div class="card"> <img class="card-img-top" src="./Image/hosp_icon.png" alt="Card image"> <div class="card-body"> <h5 class="card-title">';

    getData().then(()=>{
        // $('#hosp-list-1').empty();
        for(let i=0; i<hospital_data.length; i++){
            console.log("here");
            $('#hosp-list-1').append(
                str1 + hospital_data[i].name + '</h5> <p class="card-text">Location: ' + hospital_data[i].locality + '</p>' +
                '<p class="card-text">State: ' + hospital_data[i].city + '</p>' +
                '<button type="button" data-bs-toggle="modal" data-bs-target="#book_vac_modal" id="vac' + hospital_data[i].id + '" class="book-vac"> Book Here </button>' +
                '</div> </div>' +
                `<div class="modal fade" id="book_vac_modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="staticBackdropLabel">Book Vaccination Appointment</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form action="/book_vac_appt" method="POST" name="book_vac_appt">
                            <div class="form-group">
                                <label for="email">Email: </label>
                                <input type="email" class="form-control" id="email_user_1" name="email" readonly>
                            </div>
                            <div class="form-group">
                                <label for="hosp_id">Hospital ID: </label>
                                <input type="number" class="form-control" id="hosp_id_1" name="hosp_id" readonly>
                            </div>
                            <div class="form-group">
                                <label for="date">Appointment Date: </label>
                                <input type="date" class="form-control" id="date1" name="date">
                            </div>
                            <button type="button" class="btn btn-primary" id="update_slots_btn">Update Slots</button>
                            <br>
                    
                            <div class="form-group">
                                <label for="slot">Choose a Slot:</label>
                                <select style="padding: 0.75%;" id="slot" name="slot">
                                </select>
                            </div>
                  
                            <button type="button" id="btn2" class="btn btn-primary" formaction="/book_vac_appt" formmethod="POST">BOOK</button>
                        </form>

                    </div>
                  </div>
                </div>
              </div>`
            );
            
            $('#hosp-list-2').append(
                str1 + hospital_data[i].name + '</h5> <p class="card-text">Location: ' + hospital_data[i].locality + '</p>' +
                '<p class="card-text">State: ' + hospital_data[i].city + '</p>' +
                '<p class="card-text">Bed Count: ' + hospital_data[i].bed_count + '</p>' + 
                '<button type="button" data-bs-toggle="modal" data-bs-target="#req_bed_modal" id="bed' + hospital_data[i].id + '" class="view-hosp"> Request Here </button>' +
                '</div> </div>' +
                `<div class="modal fade" id="req_bed_modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="staticBackdropLabel">Request Bed</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form action="/req_bed" method="POST" name="req_bed_form">
                            <div class="form-group">
                                <label for="email">Email: </label>
                                <input type="email" class="form-control" id="email_user" name="email" readonly>
                            </div>
                            <div class="form-group">
                                <label for="hosp_id">Hospital ID: </label>
                                <input type="number" class="form-control" id="hosp_id_3" name="hosp_id" readonly>
                            </div>
                            <div class="form-group">
                                <label for="symptoms"> Symptoms: </label>
                                <input type="text" class="form-control" id="symptoms" name="symptoms">
                            </div>
                            
                            <button type="button" id="btn3" class="btn btn-primary" formaction="/req_bed" formmethod="POST">REQUEST</button>
                        </form>

                    </div>
                  </div>
                </div>
              </div>`
            );
            
            let idstr = "#vac" + hospital_data[i].id;
            $(idstr).click(function(e){
                e.preventDefault();
                console.log(e.target);
                $("#hosp_id_1").val(hospital_data[i].id);
                $("#email_user_1").val(user_email);
            });

            let idstr_2 = "#bed" + hospital_data[i].id;
            $(idstr_2).click(function(e){
                e.preventDefault();
                console.log(e.target);
                $("#hosp_id_3").val(hospital_data[i].id);
                $("#email_user").val(user_email);
            });
        }

        $("#update_slots_btn").click(function(e){
            e.preventDefault();
            let hospid = $("#hosp_id_1").val();
            let date = $("#date1").val();
            console.log(hospid, date);
            getSlotData(hospid, date).then(()=>{
                //append slots
                $("#slot").empty();
                console.log("slot string:", slot_string);
                slot_string = slot_string || "111111111111";
                for(let i=0; i<slot_string.length; i++){
                if(slot_string[i]=='0'){
                    let optionValue = i+1;
                    let optionText = slot_map[i+1];
                    $('#slot').append(`<option value="${optionValue}"> ${optionText} </option>`); 
                }
                }
                if(document.getElementById("slot").hasChildNodes()==false){
                alert("No slots available for specified hospital and date!");
                }
            }).catch((err)=>{
                if (err) throw err;
            })
        
        })

        $("#btn2").click(function(e){
            // e.preventDefault();
            
            let email = $("#email_user_1").val();
            let hospital_id = $("#hosp_id_1").val();
            let date = $("#date1").val();
            let slot = $("#slot").val();
    
            // console.log(hospital_id, hospital_city);
    
            $.post('/book_vac_appt', {email, hospital_id, date, slot}, function(data, status){
              console.log(status);
              console.log(data);
              if(status=="success"){
                alert("Vaccination appointment booked successfully!");
                document.location.href = './dashboard.html';
              }
              else{
                alert("Some error occurred! Please try again.");
              }
            });
        })

        $("#btn3").click(function(e){
            // e.preventDefault();
            
            // add check for 0 bed count
            let email = $("#email_user").val();
            let hospital_id = $("#hosp_id_3").val();
            let symptoms = $("#symptoms").val();
    
            // console.log(hospital_id, hospital_city);
    
            $.post('/req_bed', {email, hospital_id, symptoms}, function(data, status){
              console.log(status);
              console.log(data);
              if(status=="success"){
                alert("Bed request submitted successfully!");
                document.location.href = './dashboard.html';
              }
              else{
                alert("Some error occurred! Please try again.");
              }
            });
        })
    }).catch((err)=>{
        if (err) throw err;
    }) 
}

display_hospitals();



async function getSlotData(id, date){
    await $.post('/getslots', {hosp_id: id, apt_date: date}, function(slot_str){
        console.log(slot_str);
        slot_string = slot_str;
    })
}
let slot_string;


