document.addEventListener("DOMContentLoaded", () => {
  fetchHotels();
});

async function fetchHotels() {
  const token = localStorage.getItem("token");
 const adminId = localStorage.getItem("adminId");
const role = localStorage.getItem("role");
let url = "";
  if (role === "SuperAdmin") {
    url = "http://localhost:5194/api/Hotels"; 
  } else {
    url = `http://localhost:5194/api/Hotels/admin/${adminId}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-User-Id": adminId

      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch hotels");
    }

    const hotels = await response.json();
    populateTable(hotels);
  } catch (error) {
    console.error("Error loading hotels:", error);
    alert("Error loading hotels.");
  }
}

function populateTable(hotel) {
  const tableBody = document.querySelector("#hotelsTable tbody");
  tableBody.innerHTML = "";

  hotel.forEach(hotel => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${hotel.hotelName}</td>
      <td>${hotel.city}</td>
      <td>${hotel.starRating}</td>
      <td>${hotel.hotelType}</td>
      <td>${hotel.email}</td>
      <td>
        <button class="btn btn-sm" onclick='editHotel(${JSON.stringify(hotel)})'><i class="bi bi-pencil-square"></i></button>
<button class="btn btn-sm" onclick='confirmDelete("${hotel.hotelId}")'>
  <i class="bi bi-trash"></i>
</button>
        <button class="btn btn-sm" onclick='viewHotel(${JSON.stringify(hotel)})'><i class="bi bi-eye"></i></button>

      </td>
    `;

    tableBody.appendChild(row);
  });
}
// edit hotel
function editHotel(hotel) {
  document.getElementById("editHotelId").value = hotel.hotelId;
  document.getElementById("editHotelName").value = hotel.hotelName;
  document.getElementById("editShortDescription").value = hotel.shortDescription;
  document.getElementById("editDescription").value = hotel.description;
  document.getElementById("editHotelType").value = hotel.hotelType;
  document.getElementById("editStarRating").value = hotel.starRating;
  document.getElementById("editHotelChain").value = hotel.hotelChain;
  document.getElementById("editLogoUrl").value = hotel.logoUrl;
  document.getElementById("editCoverImageUrl").value = hotel.coverImageUrl;
  document.getElementById("editCountry").value = hotel.country;
  document.getElementById("editStateOrProvince").value = hotel.stateOrProvince;
  document.getElementById("editCity").value = hotel.city;
  document.getElementById("editAddressLine1").value = hotel.addressLine1;
  document.getElementById("editAddressLine2").value = hotel.addressLine2;
  document.getElementById("editPostalCode").value = hotel.postalCode;
  document.getElementById("editLatitude").value = hotel.latitude;
  document.getElementById("editLongitude").value = hotel.longitude;
  document.getElementById("editEmail").value = hotel.email;
  document.getElementById("editPrimaryPhone").value = hotel.primaryPhone;
  document.getElementById("editWebsiteUrl").value = hotel.websiteUrl;
  document.getElementById("editCheckInTime").value = hotel.checkInTime;
  document.getElementById("editCheckOutTime").value = hotel.checkOutTime;
  document.getElementById("editCovidSafetyLevel").value = hotel.covidSafetyLevel;
  document.getElementById("editAcceptedCurrencies").value = hotel.acceptedCurrencies;
  document.getElementById("editLanguagesSpoken").value = hotel.languagesSpoken;
  document.getElementById("editIsActive").value = hotel.isActive.toString();

  const modal = new bootstrap.Modal(document.getElementById("editHotelModal"));
  modal.show();
}
// Handle update Submit
const editHotelForm = document.getElementById("editHotelForm");

editHotelForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const token = localStorage.getItem("token");
 const adminId = localStorage.getItem("adminId");

  const id = document.getElementById("editHotelId").value;

  const updatedHotel = {
    hotelName: document.getElementById("editHotelName").value,
    shortDescription: document.getElementById("editShortDescription").value,
    description: document.getElementById("editDescription").value,
    hotelType: document.getElementById("editHotelType").value,
    starRating: parseInt(document.getElementById("editStarRating").value),
    hotelChain: document.getElementById("editHotelChain").value,
    logoUrl: document.getElementById("editLogoUrl").value,
    coverImageUrl: document.getElementById("editCoverImageUrl").value,
    country: document.getElementById("editCountry").value,
    stateOrProvince: document.getElementById("editStateOrProvince").value,
    city: document.getElementById("editCity").value,
    addressLine1: document.getElementById("editAddressLine1").value,
    addressLine2: document.getElementById("editAddressLine2").value,
    postalCode: document.getElementById("editPostalCode").value,
    latitude: parseFloat(document.getElementById("editLatitude").value),
    longitude: parseFloat(document.getElementById("editLongitude").value),
    email: document.getElementById("editEmail").value,
    primaryPhone: document.getElementById("editPrimaryPhone").value,
    websiteUrl: document.getElementById("editWebsiteUrl").value,
    checkInTime: document.getElementById("editCheckInTime").value,
    checkOutTime: document.getElementById("editCheckOutTime").value,
    covidSafetyLevel: document.getElementById("editCovidSafetyLevel").value,
    acceptedCurrencies: document.getElementById("editAcceptedCurrencies").value,
    languagesSpoken: document.getElementById("editLanguagesSpoken").value,
    isActive: document.getElementById("editIsActive").value === "true",
    hotelAdminId:adminId
  };

  try {
    const response = await fetch(`http://localhost:5194/api/Hotels/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-User-Id": adminId
      },
      body: JSON.stringify(updatedHotel)
    });

  if (response.ok) {
  bootstrap.Modal.getInstance(document.getElementById("editHotelModal")).hide();
  fetchHotels();

  const toastEl = document.getElementById("updateSuccessToast");
  const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 2000 });
  toast.show();
}


  } catch (err) {
    console.error("Error updating hotel", err);
    alert("Error occurred during update.");
  }
});

// view all hotel fuction
function viewHotel(hotel) {
  const detailsContainer = document.getElementById("viewHotelDetails");
  detailsContainer.innerHTML = `
    <dt class="col-sm-4">Hotel Name</dt><dd class="col-sm-8">${hotel.hotelName}</dd>
    <dt class="col-sm-4">Short Description</dt><dd class="col-sm-8">${hotel.shortDescription}</dd>
    <dt class="col-sm-4">Description</dt><dd class="col-sm-8">${hotel.description}</dd>
    <dt class="col-sm-4">Hotel Type</dt><dd class="col-sm-8">${hotel.hotelType}</dd>
    <dt class="col-sm-4">Star Rating</dt><dd class="col-sm-8">${hotel.starRating}</dd>
    <dt class="col-sm-4">Hotel Chain</dt><dd class="col-sm-8">${hotel.hotelChain}</dd>
    <dt class="col-sm-4">Email</dt><dd class="col-sm-8">${hotel.email}</dd>
    <dt class="col-sm-4">Phone</dt><dd class="col-sm-8">${hotel.primaryPhone}</dd>
    <dt class="col-sm-4">Website</dt><dd class="col-sm-8">${hotel.websiteUrl}</dd>
    <dt class="col-sm-4">City</dt><dd class="col-sm-8">${hotel.city}</dd>
    <dt class="col-sm-4">State / Province</dt><dd class="col-sm-8">${hotel.stateOrProvince}</dd>
    <dt class="col-sm-4">Country</dt><dd class="col-sm-8">${hotel.country}</dd>
    <dt class="col-sm-4">Address Line 1</dt><dd class="col-sm-8">${hotel.addressLine1}</dd>
    <dt class="col-sm-4">Address Line 2</dt><dd class="col-sm-8">${hotel.addressLine2}</dd>
    <dt class="col-sm-4">Postal Code</dt><dd class="col-sm-8">${hotel.postalCode}</dd>
    <dt class="col-sm-4">Latitude</dt><dd class="col-sm-8">${hotel.latitude}</dd>
    <dt class="col-sm-4">Longitude</dt><dd class="col-sm-8">${hotel.longitude}</dd>
    <dt class="col-sm-4">Check-In Time</dt><dd class="col-sm-8">${hotel.checkInTime}</dd>
    <dt class="col-sm-4">Check-Out Time</dt><dd class="col-sm-8">${hotel.checkOutTime}</dd>
    <dt class="col-sm-4">Covid Safety Level</dt><dd class="col-sm-8">${hotel.covidSafetyLevel}</dd>
    <dt class="col-sm-4">Accepted Currencies</dt><dd class="col-sm-8">${hotel.acceptedCurrencies}</dd>
    <dt class="col-sm-4">Languages Spoken</dt><dd class="col-sm-8">${hotel.languagesSpoken}</dd>
    <dt class="col-sm-4">Is Active</dt><dd class="col-sm-8">${hotel.isActive ? 'Yes' : 'No'}</dd>
  `;

  const viewModal = new bootstrap.Modal(document.getElementById("viewHotelModal"));
  viewModal.show();
}

  function confirmDelete(hotelId) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This hotel will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteHotel(hotelId); // Your existing function
        Swal.fire(
          'Deleted!',
          'The hotel has been deleted.',
          'success'
        );
      }
    });
  }


async function deleteHotel(id) {
  if (!confirm("Are you sure to delete this hotel?")) return;

  const token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");

  try {
    const response = await fetch(`http://localhost:5194/api/Hotels/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-User-Id": adminId


      }
    });

    if (response.ok) {
      alert("Hotel deleted successfully.");
      fetchHotels(); // Refresh table
    } else {
      alert("Failed to delete hotel.");
    }
  } catch (error) {
    console.error("Delete error:", error);
    alert("Error occurred during deletion.");
  }
}
