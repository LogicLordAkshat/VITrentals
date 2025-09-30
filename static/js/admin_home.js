// action listener for logout button
$(".logout-button").click(function () {
    $.ajax({
        url: "/logout",
        type: "POST",
        success: function (response) {
            window.location.href = "/";
        }
    });
});

// Load admin dashboard data
$(document).ready(function() {
    loadAdminData();
});

function loadAdminData() {
$.ajax({
        url: "/admin-data",
        type: "GET",
        success: function (data) {
            // Update stats cards
            $("#totalCars").text(data.stats.totalCars);
            $("#availableCars").text(data.stats.availableCars);
            $("#rentedCars").text(data.stats.rentedCars);
            $("#totalRevenue").text("$" + (data.stats.totalRevenue / 1000) + "K");
            
            // Update most rented model
            $("#mostRentedModel").text(data.topCars[0].model);
            $("#mostRentedCount").text(data.topCars[0].rentals);
            
            // Update most rented make
            $("#mostRentedMake").text(data.topCars[0].make);
            $("#mostRentedMakeCount").text(data.topCars[0].rentals);
            
            // Update most profitable office
            $("#mostProfitableOffice").text(data.offices[0].name);
            $("#mostProfitableRevenue").text("$" + data.offices[0].revenue.toLocaleString());
            
            // Load recent reservations
            loadRecentReservations(data.recentReservations);
            
            // Load top cars
            loadTopCars(data.topCars);
            
            // Load office performance
            loadOfficePerformance(data.offices);
        },
        error: function() {
            // Fallback to demo data if API fails
            loadDemoData();
        }
    });
}

function loadRecentReservations(reservations) {
    const tbody = $("#recentReservations");
    tbody.empty();
    
    reservations.forEach(reservation => {
        const statusClass = reservation.status === 'Active' ? 'badge bg-success' : 'badge bg-secondary';
        const row = `
            <tr>
                <td>${reservation.customer}</td>
                <td>${reservation.car}</td>
                <td>${reservation.pickup}</td>
                <td>${reservation.return}</td>
                <td>$${reservation.amount}</td>
                <td><span class="${statusClass}">${reservation.status}</span></td>
            </tr>
        `;
        tbody.append(row);
    });
}

function loadTopCars(cars) {
    const container = $("#topCars");
    container.empty();
    
    cars.forEach(car => {
        const carItem = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <strong>${car.make} ${car.model}</strong>
                    <br><small class="text-muted">${car.rentals} rentals</small>
                </div>
                <div class="text-end">
                    <strong>$${car.revenue.toLocaleString()}</strong>
                </div>
            </div>
        `;
        container.append(carItem);
    });
}

function loadOfficePerformance(offices) {
    const container = $("#officePerformance");
    container.empty();
    
    offices.forEach(office => {
        const officeItem = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <strong>${office.name}</strong>
                    <br><small class="text-muted">${office.city} - ${office.cars} cars</small>
                </div>
                <div class="text-end">
                    <strong>$${office.revenue.toLocaleString()}</strong>
                </div>
            </div>
        `;
        container.append(officeItem);
    });
}

function loadDemoData() {
    // Fallback demo data
    const demoData = {
        stats: {
            totalCars: 45,
            availableCars: 32,
            rentedCars: 13,
            totalRevenue: 125000
        },
        recentReservations: [
            { customer: "Krish Jariwala", car: "Toyota Camry (ABC123)", pickup: "2024-01-15", return: "2024-01-20", amount: 250, status: "Active" },
            { customer: "Akshat Srivastava", car: "Honda Civic (XYZ789)", pickup: "2024-01-10", return: "2024-01-25", amount: 675, status: "Completed" }
        ],
        topCars: [
            { make: "Toyota", model: "Camry", rentals: 45, revenue: 22500 },
            { make: "Honda", model: "Civic", rentals: 38, revenue: 17100 }
        ],
        offices: [
            { name: "Downtown Branch", city: "New York", cars: 15, revenue: 45000 },
            { name: "Airport Branch", city: "Los Angeles", cars: 12, revenue: 38000 }
        ]
    };
    
    // Update with demo data
    $("#totalCars").text(demoData.stats.totalCars);
    $("#availableCars").text(demoData.stats.availableCars);
    $("#rentedCars").text(demoData.stats.rentedCars);
    $("#totalRevenue").text("$" + (demoData.stats.totalRevenue / 1000) + "K");
    
    loadRecentReservations(demoData.recentReservations);
    loadTopCars(demoData.topCars);
    loadOfficePerformance(demoData.offices);
}