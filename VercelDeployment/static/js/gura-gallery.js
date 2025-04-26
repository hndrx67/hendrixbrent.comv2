 // Global variables
 let currentImageToDownload = null;
 let isSorted = false;
 
 // Initialize the page
 window.onload = function() {
     updateClock();
     setInterval(updateClock, 1000);
 };
 
 // Search function
 function searchVtubers() {
     const searchInput = document.getElementById('searchInput').value.toLowerCase();
     const items = document.querySelectorAll('.gallery-item');
     let visibleCount = 0;
     
     items.forEach(item => {
         const title = item.querySelector('.gallery-title').textContent.toLowerCase();
         const description = item.querySelector('.gallery-description').textContent.toLowerCase();
         
         if (title.includes(searchInput) || description.includes(searchInput)) {
             item.classList.remove('hidden');
             visibleCount++;
         } else {
             item.classList.add('hidden');
         }
     });
     
     // Update status bar
     document.getElementById('status-count').textContent = `${visibleCount} items`;
 }
 
 // Download function
 function downloadImage(element, event) {
     event.preventDefault();
     
     const item = element.closest('.gallery-item');
     const title = item.querySelector('.gallery-title').textContent;
     const img = item.querySelector('.gallery-image');
     
     // In a real scenario, we would use the actual image src
     // For this demo, we'll show the dialog and simulate downloading
     document.getElementById('downloadFileName').textContent = `${title.replace(/\s+/g, '_')}.jpg`;
     currentImageToDownload = img;
     
     showDialog('downloadDialog');
 }
 
 function confirmDownload() {
     // In a real application with actual images, this would trigger the download
     // Since we're working with placeholder images, we'll simulate the download
     
     // Create a link element
     const downloadLink = document.createElement('a');
     
     // In a real scenario, we'd set the href to the image src
     // For demonstration purposes (with empty images), we'll create a dummy blob
     const blob = new Blob(['static/Gawr.Gura.full.4468484.jpg'], { type: 'image/jpeg' });
     const url = URL.createObjectURL(blob);
     
     downloadLink.href = url;
     downloadLink.download = document.getElementById('downloadFileName').textContent;
     
     // Append to the body, click, and remove
     document.body.appendChild(downloadLink);
     downloadLink.click();
     document.body.removeChild(downloadLink);
     
     // Clean up the object URL
     URL.revokeObjectURL(url);
     
     closeDialog('downloadDialog');
 }
 
 // View functions
 function setGridView() {
     document.getElementById('gallery').classList.remove('list-view');
     document.querySelectorAll('.view-button').forEach(btn => btn.classList.remove('active'));
     document.querySelectorAll('.view-button')[0].classList.add('active');
 }
 
 function setListView() {
     document.getElementById('gallery').classList.add('list-view');
     document.querySelectorAll('.view-button').forEach(btn => btn.classList.remove('active'));
     document.querySelectorAll('.view-button')[1].classList.add('active');
 }
 
 // Sort function
 function sortGallery() {
     const gallery = document.getElementById('gallery');
     const items = Array.from(gallery.querySelectorAll('.gallery-item'));
     
     items.sort((a, b) => {
         const titleA = a.querySelector('.gallery-title').textContent;
         const titleB = b.querySelector('.gallery-title').textContent;
         
         return isSorted ? titleB.localeCompare(titleA) : titleA.localeCompare(titleB);
     });
     
     // Clear gallery and append sorted items
     gallery.innerHTML = '';
     items.forEach(item => gallery.appendChild(item));
     
     // Toggle sort direction for next click
     isSorted = !isSorted;
 }
 
 // Reset function
 function resetGallery() {
     document.getElementById('searchInput').value = '';
     const items = document.querySelectorAll('.gallery-item');
     items.forEach(item => item.classList.remove('hidden'));
     document.getElementById('status-count').textContent = `${items.length} items`;
 }
 
 // Dialog functions
 function showDialog(dialogId) {
     document.getElementById(dialogId).style.display = 'block';
 }
 
 function closeDialog(dialogId) {
     document.getElementById(dialogId).style.display = 'none';
 }
 
 // Window control functions
 function showHelp() {
     showDialog('helpDialog');
 }
 
 function minimizeWindow() {
     alert('Window would minimize (simulated)');
 }
 
 function closeWindow() {
     if (confirm('Close VTuber Gallery?')) {
         alert('Window would close (simulated)');
     }
 }
 
 // Menu functions
 function showFileMenu() {
     alert('YOU ARE GAY');
 }
 
 function showEditMenu() {
     alert('YOU ARE LGBTQ+');
 }
 
 function showViewMenu() {
     alert('YOU ARE A GAY SIMP');
 }
 
 function showHelpMenu() {
     showDialog('helpDialog');
 }
 
 // Clock function
 function updateClock() {
     const now = new Date();
     const hours = now.getHours().toString().padStart(2, '0');
     const minutes = now.getMinutes().toString().padStart(2, '0');
     const seconds = now.getSeconds().toString().padStart(2, '0');
     document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
 }