const container = document.getElementById('window-container');
const addWindowBtn = document.getElementById('add-window-btn');
let windowCount = 0;

/** ---- Utility Functions ---- **/

// Save all windows data to localStorage
function saveWindowsToLocalStorage() {
  const allWindows = Array.from(container.querySelectorAll('.draggable-box')).map((box) => {
    return {
      id: box.dataset.id,
      position: {
        left: box.style.left || '100px',
        top: box.style.top || '100px',
      },
      size: {
        width: box.style.width || '300px',
        height: box.style.height || '200px',
      },
      title: box.querySelector('.title-text').textContent || 'Untitled',
      backgroundColor: box.style.backgroundColor || '#ffffff',
    };
  });

  localStorage.setItem('windows', JSON.stringify(allWindows));
}

// Restore all windows from localStorage
function restoreWindowsFromLocalStorage() {
  const savedWindows = JSON.parse(localStorage.getItem('windows')) || [];
  savedWindows.forEach((data) => createNewWindow(data));
}

/** ---- Window Creation ---- **/

// Create a new draggable and resizable window
function createNewWindow({ id = `window-${windowCount++}`, position = {}, size = {}, title = 'Untitled', backgroundColor = '#ffffff' }) {
  const box = document.createElement('div');
  box.classList.add('draggable-box');
  box.dataset.id = id; // Assign a unique identifier

  // Set initial position, size, and background color
  box.style.left = position.left || '100px';
  box.style.top = position.top || '100px';
  box.style.width = size.width || '300px';
  box.style.height = size.height || '200px';
  box.style.backgroundColor = backgroundColor;

  // Populate window content
  box.innerHTML = `
  <div class="top-bar">
    <span class="title-text">${title}</span>
    <div class="icon-container">
      <span class="icon" data-action="close">X</span>
      <span class="icon" data-action="minimize">-</span>
      <span class="icon" data-action="reset">#</span>
    </div>
  </div>
  <div class="content">
    <p></p>
  </div>
  <!-- Moved expand icon outside of the title bar -->
  <span class="expand-icon" data-action="expand">&gt;</span> 
  <span class="cog-icon"></span>
  <input type="text" class="hex-color-input" placeholder="HEX Code #FF.." />
  <div class="expanded-content hidden"></div>
`;



  // Append the box to the container
  container.appendChild(box);

  // Make the box draggable and resizable
  makeDraggable(box);
  makeResizable(box);

  // Add functionality for title editing, cog icon, and icon actions
  attachWindowControls(box);

  // Save the updated windows list
  saveWindowsToLocalStorage();
}

/** ---- Dragging Functionality ---- **/

function makeDraggable(box) {
  const titleBar = box.querySelector('.top-bar');
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  titleBar.addEventListener('mousedown', (event) => {
    isDragging = true;
    offsetX = event.clientX - box.offsetLeft;
    offsetY = event.clientY - box.offsetTop;
    titleBar.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    event.preventDefault();
    box.style.left = `${event.clientX - offsetX}px`;
    box.style.top = `${event.clientY - offsetY}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      titleBar.style.cursor = 'grab';
      saveWindowsToLocalStorage();
    }
  });
}

/** ---- Resizing Handles ---- **/

function makeResizable(box) {
  // Create the resize overlay (always hidden by default)
  const resizeOverlay = document.createElement('div');
  resizeOverlay.className = 'resize-overlay';
  resizeOverlay.style.opacity = '0'; // Start hidden
  box.appendChild(resizeOverlay);

  // Initialize ResizeObserver
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      const aspectRatio = (width / height).toFixed(2);

      // Display the overlay while resizing
      resizeOverlay.textContent = `W: ${Math.round(width)}px, H: ${Math.round(height)}px,AR: ${aspectRatio}`;
      // stuff goes here!
      if (box._resizeTimeout)
      resizeOverlay.style.opacity = '0.5'; // Make it visible during resizing

      // Hide the overlay after a short delay
      if (box._resizeTimeout) clearTimeout(box._resizeTimeout);
      box._resizeTimeout = setTimeout(() => {
        resizeOverlay.style.opacity = '0'; // Hide after resizing ends
      }, 1000);

      // Save updated size to localStorage
      saveWindowsToLocalStorage();
    }
  });

  // Observe the box for resizing events
  resizeObserver.observe(box);
}

/**function makeResizable(box) {
  const resizeObserver = new ResizeObserver(() => saveWindowsToLocalStorage());
  resizeObserver.observe(box);
}**/

/** ---- Attach Window Controls ---- **/

function attachWindowControls(box) {
  const icons = box.querySelectorAll('.icon');
  const cogIcon = box.querySelector('.cog-icon');
  const colorInput = box.querySelector('.hex-color-input');
  const content = box.querySelector('.content');
  const titleText = box.querySelector('.title-text');
  const expandIcon = box.querySelector('.expand-icon');
  const expandedContent = box.querySelector('.expanded-content');

  // Attach event listener for the expand icon
  expandIcon.addEventListener('click', () => {
    if (expandedContent.classList.contains('hidden')) {
      // Show the expanded content
      expandedContent.classList.remove('hidden');
      expandedContent.style.display = 'block';

      // Optional: Add animations or position adjustments
      expandedContent.innerHTML = `<p>Expanded content here!</p>`; // Add placeholder content
    } else {
      // Hide the expanded content
      expandedContent.classList.add('hidden');
      expandedContent.style.display = 'none';
    }
  });



  // Handle title editing
  titleText.addEventListener('dblclick', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = titleText.textContent;
    box.querySelector('.top-bar').replaceChild(input, titleText);

    input.focus();
    const saveTitle = () => {
      titleText.textContent = input.value || 'Untitled';
      box.querySelector('.top-bar').replaceChild(titleText, input);
      saveWindowsToLocalStorage();
    };
    input.addEventListener('blur', saveTitle);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') saveTitle();
    });
  });

  // Handle icon actions
  icons.forEach((icon) => {
    icon.addEventListener('click', () => {
      const action = icon.dataset.action;
      if (action === 'close') {
        box.remove(); // Remove the box
        saveWindowsToLocalStorage();
      } else if (action === 'minimize') {
        content.style.display = content.style.display === 'none' ? 'block' : 'none'; // Toggle visibility
      } else if (action === 'reset') {
        box.style.left = '100px';
        box.style.top = '100px';
        box.style.width = '300px';
        box.style.height = '200px';
        saveWindowsToLocalStorage();
      }
    });
  });

  // Show color input when clicking the cog icon
  cogIcon.addEventListener('click', () => {
    colorInput.style.display = 'block';
    colorInput.focus();
  });

  // Apply background color and save when pressing enter
  colorInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const colorCode = colorInput.value.trim();
      if (/^[0-9A-F]{6}$/i.test(colorCode)) { // Validate hex color input
        box.style.backgroundColor =  colorCode;
        saveWindowsToLocalStorage();
      } else {
        alert('Please enter a valid hex color code (e.g., #FF5733).');
      }
      colorInput.style.display = 'none'; // Hide input after use
    }
  });

  // Hide color input when clicking outside
  colorInput.addEventListener('blur', () => {
    colorInput.style.display = 'none';
  });
}


/** ---- Show/Hide the + Button ---- **/

document.addEventListener('mousemove', (event) => {
  const { clientX, clientY, view } = event;

  // Define the hover zone (bottom-right corner, 100px x 100px)
  const isInHoverZone =
    clientX > view.innerWidth - 100 && clientY > view.innerHeight - 100;

  // Add/remove the visible class based on whether the mouse is in the zone
  if (isInHoverZone) {
    addWindowBtn.classList.add('visible');
  } else {
    addWindowBtn.classList.remove('visible');
  }
});


/** ---- Initialize New Windows ---- **/

// Handle "Add Window" button
addWindowBtn.addEventListener('click', () => createNewWindow({}));

// Restore windows on page load
document.addEventListener('DOMContentLoaded', restoreWindowsFromLocalStorage);









