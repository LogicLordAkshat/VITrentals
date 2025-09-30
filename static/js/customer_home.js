// wait for the DOM to be loaded
$(document).ready(function () {
    loadCustomerData();
});

function loadCustomerData() {
    $.ajax({
        url: '/customer-data',
        type: 'GET',
        success: function (data) {
            // Update user profile
            $('.customer-name').text(data.user.name);
            $('#userName').text(data.user.name);
            $('#userEmail').text(data.user.email);
            $('#memberSince').text(data.user.memberSince);
            $('#totalRentals').text(data.user.totalRentals);
            $('#loyaltyPoints').text(data.user.loyaltyPoints.toLocaleString());
            
            // Load available cars
            loadAvailableCars(data.availableCars);
            
            // Load reservations
            loadReservations(data.myReservations);
        },
        error: function() {
            // Fallback to demo data
            loadDemoCustomerData();
        }
    });
}

function loadAvailableCars(cars) {
    const container = $('#availableCars');
    container.empty();
    
    cars.forEach(car => {
        const category = getCarCategory(car.price);
        const categoryClass = getCategoryClass(category);
        const rating = Math.floor(Math.random() * 2) + 4; // Random rating 4-5
        const reviews = Math.floor(Math.random() * 50) + 10; // Random reviews 10-60
        
        const carCard = `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 shadow-sm car-card" data-category="${category}" data-price="${car.price}" data-year="${car.year}">
                    <div class="position-relative">
                        <img src="${car.image}" class="card-img-top" alt="${car.model}" style="height: 220px; object-fit: cover;">
                        <div class="position-absolute top-0 end-0 m-2">
                            <span class="badge ${categoryClass}">${category}</span>
                        </div>
                        <div class="position-absolute top-0 start-0 m-2">
                            <span class="badge bg-success">Available</span>
                        </div>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title mb-0">${car.make} ${car.model}</h5>
                            <div class="text-end">
                                <div class="h4 text-primary mb-0">$${car.price}</div>
                                <small class="text-muted">per day</small>
                            </div>
                        </div>
                        
                        <div class="mb-2">
                            <div class="d-flex align-items-center mb-1">
                                <span class="text-warning">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</span>
                                <span class="ms-2 text-muted small">(${reviews} reviews)</span>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <div class="row text-center">
                                <div class="col-4">
                                    <div class="border-end">
                                        <div class="fw-bold">${car.year}</div>
                                        <small class="text-muted">Year</small>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="border-end">
                                        <div class="fw-bold">${Math.floor(Math.random() * 5) + 4}L</div>
                                        <small class="text-muted">Engine</small>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="fw-bold">${Math.floor(Math.random() * 2) + 4}</div>
                                    <small class="text-muted">Seats</small>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <div class="d-flex flex-wrap gap-1">
                                ${car.features.map(feature => `<span class="badge bg-light text-dark border">${feature}</span>`).join('')}
                            </div>
                        </div>
                        
                        <div class="mt-auto">
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary" onclick="reserveCar(${car.id})">
                                    <i class="fas fa-calendar-plus me-1"></i> Reserve Now
                                </button>
                                <button class="btn btn-outline-secondary btn-sm" onclick="viewCarDetails(${car.id})">
                                    <i class="fas fa-info-circle me-1"></i> View Details
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

function getCarCategory(price) {
    if (price < 50) return 'Economy';
    if (price < 75) return 'Standard';
    if (price < 100) return 'Premium';
    return 'Luxury';
}

function getCategoryClass(category) {
    switch(category) {
        case 'Economy': return 'bg-success';
        case 'Standard': return 'bg-primary';
        case 'Premium': return 'bg-warning';
        case 'Luxury': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

function filterCars(category) {
    $('.car-card').show();
    if (category !== 'all') {
        $('.car-card').not(`[data-category="${category}"]`).hide();
    }
}

function applyFilters() {
    const searchTerm = $('#searchCars').val().toLowerCase();
    const priceFilter = $('#priceFilter').val();
    const yearFilter = $('#yearFilter').val();
    
    $('.car-card').each(function() {
        const carText = $(this).text().toLowerCase();
        const price = parseInt($(this).data('price'));
        const year = $(this).data('year').toString();
        
        let show = true;
        
        if (searchTerm && !carText.includes(searchTerm)) {
            show = false;
        }
        
        if (priceFilter) {
            const [min, max] = priceFilter.split('-').map(Number);
            if (price < min || (max && price > max)) {
                show = false;
            }
        }
        
        if (yearFilter && year !== yearFilter) {
            show = false;
        }
        
        $(this).toggle(show);
    });
}

function viewCarDetails(carId) {
    alertify.alert('Car Details', 'This would show detailed information about the car including specifications, photos, and customer reviews.', function(){
        alertify.success('Opening car details...');
    });
}

function loadReservations(reservations) {
    const tbody = $('.customer-reservation');
    tbody.empty();
    
    reservations.forEach(reservation => {
        const statusClass = reservation.status === 'Active' ? 'badge bg-success' : 'badge bg-secondary';
        const row = `
            <tr>
                <td>${reservation.id}</td>
                <td>${reservation.car}</td>
                <td>${reservation.pickup}</td>
                <td>${reservation.return}</td>
                <td>$${reservation.amount}</td>
                <td><span class="${statusClass}">${reservation.status}</span></td>
                <td>
                    ${reservation.status === 'Active' ? 
                        '<button type="button" class="btn btn-outline-success pay-button" id="' + reservation.id + '">Pay</button>' : 
                        'Paid'
                    }
                </td>
            </tr>
        `;
        tbody.append(row);
    });
    
    // Add click event to pay buttons
            $(".pay-button").click(function () {
                $.ajax({
                    url: "/pay-reservation",
                    type: "POST",
                    data: {
                        reservation_no: this.id
                    },
                    success: function (response) {
                alertify.notify('Reservation Paid successfully', 'success', 3, function () { 
                    window.location.href = "/customer-home"; 
            });
        }
    });
});
}

function loadDemoCustomerData() {
    const demoData = {
        user: {
            name: "Krish Jariwala",
            email: "customer@demo.com",
            memberSince: "June 2023",
            totalRentals: 12,
            loyaltyPoints: 1250
        },
        availableCars: [
            { id: 1, model: "Toyota Camry", make: "Toyota", year: 2022, price: 50, image: "/car.png", features: ["GPS", "Bluetooth", "Backup Camera"] },
            { id: 2, model: "Honda Accord", make: "Honda", year: 2023, price: 55, image: "/car.png", features: ["GPS", "Bluetooth", "Sunroof"] },
            { id: 3, model: "Ford Focus", make: "Ford", year: 2021, price: 45, image: "/car.png", features: ["GPS", "Bluetooth"] },
            { id: 4, model: "BMW 3 Series", make: "BMW", year: 2023, price: 75, image: "/car.png", features: ["GPS", "Bluetooth", "Leather Seats", "Sunroof"] }
        ],
        myReservations: [
            { id: 1, car: "Toyota Camry (ABC123)", pickup: "2024-01-15", return: "2024-01-20", status: "Active", amount: 250 },
            { id: 2, car: "Honda Civic (XYZ789)", pickup: "2024-01-05", return: "2024-01-10", status: "Completed", amount: 225 },
            { id: 3, car: "Ford Focus (DEF456)", pickup: "2023-12-20", return: "2023-12-25", status: "Completed", amount: 200 }
        ]
    };
    
    // Update with demo data
    $('.customer-name').text(demoData.user.name);
    $('#userName').text(demoData.user.name);
    $('#userEmail').text(demoData.user.email);
    $('#memberSince').text(demoData.user.memberSince);
    $('#totalRentals').text(demoData.user.totalRentals);
    $('#loyaltyPoints').text(demoData.user.loyaltyPoints.toLocaleString());
    
    loadAvailableCars(demoData.availableCars);
    loadReservations(demoData.myReservations);
}

function reserveCar(carId) {
    alertify.confirm('Reserve Car', 'Are you sure you want to reserve this car?', 
        function(){ 
            alertify.success('Car reserved successfully! Redirecting to reservation page...');
            setTimeout(() => {
                window.location.href = "/reserve";
            }, 1500);
        }, 
        function(){ 
            alertify.error('Reservation cancelled');
        }
    );
}
$(".logout-button").click(function () {
    $.ajax({
        url: "/logout",
        type: "POST",
        success: function (response) {
            window.location.href = "/";
        }
    });
});

$("#new_res").click(function () {
    $.ajax({
        url: "/reserve",
        type: "GET",
        success: function (response) {
            window.location.href = "/reserve";
        }
    });
});