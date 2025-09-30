let refStatuss = ["Available", "In Maintainance", "Being Cleaned", "Rented"];

let statuss = ["Available", "In Maintainance", "Being Cleaned", "Rented"];

// wait for the DOM to be loaded
$(document).ready(function () {
    loadOfficeData();
});

function loadOfficeData() {
    $.ajax({
        url: '/office-data',
        type: 'GET',
        success: function (data) {
            // Update office info
            $('.office-name').text(data.office.name);
            
            // Update stats
            $('#totalCars').text(data.office.totalCars);
            $('#availableCars').text(data.office.availableCars);
            $('#rentedCars').text(data.office.rentedCars);
            $('#maintenanceCars').text(data.office.maintenanceCars);
            $('#todayRevenue').text('$' + data.revenue.today.toLocaleString());
            $('#growthRate').text('+' + data.revenue.growth + '%');
            
            // Update revenue overview
            $('#weekRevenue').text('$' + data.revenue.thisWeek.toLocaleString());
            $('#monthRevenue').text('$' + data.revenue.thisMonth.toLocaleString());
            $('#lastMonthRevenue').text('$' + data.revenue.lastMonth.toLocaleString());
            $('#avgRating').text(data.analytics.customerStats.averageRating + ' ⭐');
            
            // Load analytics
            loadTopPerformingCars(data.analytics.topPerformingCars);
            loadMaintenanceSchedule(data.analytics.maintenanceSchedule);
            
            // Load my cars
            loadMyCars(data.myCars);
            
            // Load reservations
            loadReservations(data.reservations);
        },
        error: function() {
            // Fallback to demo data
            loadDemoOfficeData();
        }
    });
}

function loadMyCars(cars) {
    const container = $('#myCars');
    container.empty();
    
    cars.forEach(car => {
        const statusClass = getStatusClass(car.status);
        const fuelIcon = car.fuelType === 'Electric' ? '⚡' : '⛽';
        const carCard = `
            <div class="col-lg-4 col-md-6 mb-3 car-card" data-status="${car.status}">
                <div class="card h-100 shadow-sm">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">${car.make} ${car.model}</h6>
                        <span class="badge ${statusClass}">${car.status}</span>
                    </div>
                    <div class="card-body">
                        <div class="row mb-2">
                            <div class="col-6">
                                <small class="text-muted">Plate ID</small>
                                <div class="fw-bold">${car.plate_id}</div>
                            </div>
                            <div class="col-6">
                                <small class="text-muted">Year</small>
                                <div class="fw-bold">${car.year}</div>
                            </div>
                        </div>
                        
                        <div class="row mb-2">
                            <div class="col-6">
                                <small class="text-muted">Price/Day</small>
                                <div class="fw-bold text-primary">$${car.price}</div>
                            </div>
                            <div class="col-6">
                                <small class="text-muted">Fuel Type</small>
                                <div class="fw-bold">${fuelIcon} ${car.fuelType}</div>
                            </div>
                        </div>
                        
                        <div class="row mb-2">
                            <div class="col-6">
                                <small class="text-muted">Mileage</small>
                                <div class="fw-bold">${car.mileage.toLocaleString()} mi</div>
                            </div>
                            <div class="col-6">
                                <small class="text-muted">Total Rentals</small>
                                <div class="fw-bold">${car.totalRentals}</div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <small class="text-muted">Last Service</small>
                            <div class="fw-bold">${car.lastService}</div>
                        </div>
                        
                        <div class="d-grid gap-2">
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-primary" onclick="changeStatus('${car.plate_id}')">
                                    <i class="fas fa-edit"></i> Change Status
                                </button>
                                <button class="btn btn-sm btn-outline-info" onclick="viewCarDetails('${car.plate_id}')">
                                    <i class="fas fa-info"></i> Details
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteCar('${car.plate_id}')">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.append(carCard);
    });
}

function loadTopPerformingCars(cars) {
    const container = $('#topPerformingCars');
    container.empty();
    
    cars.forEach((car, index) => {
        const carItem = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                    <span class="badge bg-primary me-2">#${index + 1}</span>
                    <div>
                        <div class="fw-bold">${car.model}</div>
                        <small class="text-muted">${car.rentals} rentals</small>
                    </div>
                </div>
                <div class="text-end">
                    <div class="fw-bold text-success">$${car.revenue.toLocaleString()}</div>
                    <small class="text-muted">revenue</small>
                </div>
            </div>
        `;
        container.append(carItem);
    });
}

function loadMaintenanceSchedule(schedule) {
    const container = $('#maintenanceSchedule');
    container.empty();
    
    schedule.forEach(item => {
        const priorityClass = getPriorityClass(item.priority);
        const itemHtml = `
            <div class="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                <div>
                    <div class="fw-bold">${item.model} (${item.plate_id})</div>
                    <small class="text-muted">${item.service}</small>
                </div>
                <div class="text-end">
                    <span class="badge ${priorityClass}">${item.priority}</span>
                    <div class="small text-muted">${item.dueDate}</div>
                </div>
            </div>
        `;
        container.append(itemHtml);
    });
}

function getPriorityClass(priority) {
    switch(priority) {
        case 'High': return 'bg-danger';
        case 'Medium': return 'bg-warning';
        case 'Low': return 'bg-success';
        default: return 'bg-secondary';
    }
}

function filterCars(status) {
    $('.car-card').show();
    if (status !== 'all') {
        $('.car-card').not(`[data-status="${status}"]`).hide();
    }
}

function viewCarDetails(plateId) {
    alertify.alert('Car Details', `Detailed information for car ${plateId} including service history, rental records, and maintenance schedule.`, function(){
        alertify.success('Opening car details...');
    });
}

function loadReservations(reservations) {
    const tbody = $('.office-reservation');
    tbody.empty();
    
    reservations.forEach(reservation => {
        const row = `
            <tr>
                <td>${reservation.id}</td>
                <td>${reservation.car}</td>
                <td>${reservation.customer}</td>
                <td>${reservation.pickup}</td>
                <td>${reservation.pickup}</td>
                <td>${reservation.return}</td>
                <td>$${reservation.amount}</td>
            </tr>
        `;
        tbody.append(row);
    });
}

function getStatusClass(status) {
    switch(status) {
        case 'Available': return 'bg-success';
        case 'Rented': return 'bg-warning';
        case 'Maintenance': return 'bg-danger';
        case 'Being Cleaned': return 'bg-info';
        default: return 'bg-secondary';
    }
}

function changeStatus(plateId) {
    alertify.confirm('Change Status', 'Select new status for this car:', 
        function(){ 
            alertify.success('Status updated successfully!');
        }, 
        function(){ 
            alertify.error('Status change cancelled');
        }
    );
}

function deleteCar(plateId) {
    alertify.confirm('Delete Car', 'Are you sure you want to delete this car?', 
        function(){ 
            alertify.success('Car deleted successfully!');
        }, 
        function(){ 
            alertify.error('Deletion cancelled');
        }
    );
}

function loadDemoOfficeData() {
    const demoData = {
        office: {
            name: "Downtown Branch",
            totalCars: 15,
            availableCars: 12,
            rentedCars: 3
        },
        revenue: {
            today: 1250
        },
        myCars: [
            { plate_id: "ABC123", model: "Camry", make: "Toyota", year: 2022, price: 50, status: "Available", lastService: "2024-01-01", totalRentals: 45 },
            { plate_id: "XYZ789", model: "Civic", make: "Honda", year: 2023, price: 45, status: "Rented", lastService: "2023-12-15", totalRentals: 38 },
            { plate_id: "DEF456", model: "Accord", make: "Honda", year: 2021, price: 55, status: "Maintenance", lastService: "2024-01-10", totalRentals: 32 },
            { plate_id: "GHI789", model: "Focus", make: "Ford", year: 2022, price: 45, status: "Available", lastService: "2023-12-20", totalRentals: 28 }
        ],
        reservations: [
            { id: 1, customer: "Krish Jariwala", car: "Toyota Camry (ABC123)", pickup: "2024-01-15", return: "2024-01-20", amount: 250 },
            { id: 2, customer: "Akshat Srivastava", car: "Honda Civic (XYZ789)", pickup: "2024-01-10", return: "2024-01-25", amount: 675 },
            { id: 3, customer: "Mike Johnson", car: "Honda Accord (DEF456)", pickup: "2024-01-12", return: "2024-01-18", amount: 300 }
        ]
    };
    
    // Update with demo data
    $('.office-name').text(demoData.office.name);
    $('#totalCars').text(demoData.office.totalCars);
    $('#availableCars').text(demoData.office.availableCars);
    $('#rentedCars').text(demoData.office.rentedCars);
    $('#todayRevenue').text('$' + demoData.revenue.today.toLocaleString());
    
    loadMyCars(demoData.myCars);
    loadReservations(demoData.reservations);
}

    $('.office-cars').on('change', 'select', function (e) {
        var new_status = refStatuss.indexOf($(this).find(":selected").text());
        console.log(new_status);
        console.log($(this).find(":selected").text())
        console.log($(this).closest('tr').children('td:first').text());
        $.ajax({
            url: "/add-new-status",
            type: "POST",
            data: {
                plate_id: $(this).closest('tr').children('td:first').text(),
                status: new_status
            },
            success: function (response) {
                console.log(response);
                if (response.success == true)
                    var notification = alertify.notify("Status Updated Successfully", 'success');

            },
            error: function (response) {
                console.log(response);
            }
        });

    });
    $('.office-cars').on('click', 'button', function (e) {
        //console.log($(this).closest('tr').children('td:first').text());
        $(this).closest('tr').remove();
        $.ajax({
            url: "/delete-car",
            type: "POST",
            data: {
                plate_id: $(this).closest('tr').children('td:first').text()
            },
            success: function (response) {
                //window.location.href = "/";
                console.log(response);
            }
        });
    });
    $(".logout-button").click(function () {
        $.ajax({
            url: "/logout",
            type: "POST",
            success: function (response) {
                window.location.href = "/";
            }
        });
    });

    $("#add_car_btn").click(function () {
        $.ajax({
            url: "/add-car",
            type: "GET",
            success: function (response) {
                window.location.href = "/add-car";
            }
        });
    });
});