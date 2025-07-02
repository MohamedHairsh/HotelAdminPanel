document.addEventListener("DOMContentLoaded", () => {
  loadRooms();
  document.getElementById("roomForm").addEventListener("submit", saveRoom);
});

async function loadRooms() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("adminId");

  try {
    const res = await fetch("http://localhost:5194/api/HotelRooms", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-User-Id": userId
      }
    });

    if (!res.ok) throw new Error("Failed to load rooms");

    const data = await res.json();
    renderRooms(data);
  } catch (error) {
    console.error("Room load error:", error);
    showToast("Error loading rooms", true);
  }
}

function renderRooms(rooms) {
  const tbody = document.querySelector("#roomsTable tbody");
  tbody.innerHTML = "";

  rooms.forEach(room => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${room.roomName}</td>
      <td>${room.roomType}</td>
      <td>${room.bedType}</td>
      <td>${room.maxAdults}</td>
      <td>${room.maxChildren}</td>
      <td>₹${room.basePrice}</td>
      <td>${room.roomStatus}</td>
      <td>
        <button class="btn btn-sm  me-1" onclick='editRoom(${JSON.stringify(room)})'>
  <i class="fas fa-pencil-alt"></i>
</button>

<!-- Delete button with trash icon -->
<button class="btn btn-sm " onclick='confirmDelete("${room.roomId}")'>
  <i class="fas fa-trash"></i>
</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function confirmDelete(roomId) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This room will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) { 
        deleteRoom(roomId);
        Swal.fire(
          'Deleted!',
          'The Room has been deleted.',
          'success'
        );
      }
    });
  }
function editRoom(room) {
  for (const key in room) {
    const input = document.getElementById(key);
    if (input) input.value = room[key];
  }

  const modal = new bootstrap.Modal(document.getElementById("roomModal"));
  modal.show();
}

async function saveRoom(e) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const adminId = localStorage.getItem("adminId"); // dynamically assigned hotel

  const id = document.getElementById("roomId").value;
  const room = {
    hotelId: adminId,
    roomName: document.getElementById("roomName").value,
    roomType: document.getElementById("roomType").value,
    bedType: document.getElementById("bedType").value,
    maxAdults: parseInt(document.getElementById("maxAdults").value),
    maxChildren: parseInt(document.getElementById("maxChildren").value),
    roomSize: document.getElementById("roomSize").value,
    basePrice: parseFloat(document.getElementById("basePrice").value),
    roomStatus: document.getElementById("roomStatus").value,
    refundPolicy: document.getElementById("refundPolicy").value,
    breakfastIncluded: document.getElementById("breakfastIncluded").value === "true",
    availableRooms: parseInt(document.getElementById("availableRooms").value),
    roomImagesJson: document.getElementById("roomImagesJson").value
  };

  const method = id ? "PUT" : "POST";
  const url = id
    ? `http://localhost:5194/api/HotelRooms/${id}`
    : `http://localhost:5194/api/HotelRooms`;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-User-Id": adminId
      },
      body: JSON.stringify(room)
    });

    if (res.ok) {
      bootstrap.Modal.getInstance(document.getElementById("roomModal")).hide();
      showToast(id ? "Room updated successfully!" : "Room added successfully!");
      loadRooms();
    } else {
      throw new Error("Room save failed");
    }
  } catch (error) {
    console.error("Save error:", error);
    showToast("Only authorized users can create rooms.", true);
  }
}

async function deleteRoom(id) {
  const token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");

  if (!confirm("Are you sure you want to delete this room?")) return;

  try {
    const res = await fetch(`http://localhost:5194/api/HotelRooms/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-User-Id": adminId
      }
    });

    if (res.ok) {
      showToast("Room deleted successfully!");
      loadRooms();
    } else {
      throw new Error("Delete failed");
    }
  } catch (error) {
    console.error("Delete error:", error);
    showToast("Error deleting room", true);
  }
}
function clearRoomForm() {
  document.getElementById("roomForm").reset();
  document.getElementById("roomId").value = "";
  // Optional toast to indicate form reset
  // showToast("Ready to add new room!");
}

function showToast(message, error = false) {
  const toastEl = document.getElementById("toastMessage");
  document.getElementById("toastText").innerText = message;
  toastEl.classList.toggle("text-bg-danger", error);
  toastEl.classList.toggle("text-bg-success", !error);
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}
