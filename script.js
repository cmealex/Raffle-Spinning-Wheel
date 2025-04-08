// Simple Raffle Wheel Implementation
class RaffleWheel {
    constructor() {
        // Basic setup
        this.canvas = document.getElementById('wheel');
        this.ctx = this.canvas.getContext('2d');
        this.wheelRadius = 200;
        this.centerX = this.wheelRadius + 50;
        this.centerY = this.wheelRadius + 50;
        this.canvas.width = this.centerX * 2;
        this.canvas.height = this.centerY * 2;
        
        // Simple properties
        this.names = [];
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'];
        this.currentRotation = 0;
        this.isSpinning = false;
        this.winners = [];
        
        // Setup
        document.getElementById('startRaffle').addEventListener('click', () => this.startRaffle());
        this.drawEmptyWheel();
    }

    // Draw empty wheel
    drawEmptyWheel() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw circle
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.wheelRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#f5f5f5';
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw center
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 20, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw text
        this.ctx.fillStyle = '#999';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Enter names and click Start Raffle', this.centerX, this.centerY);
        
        // Draw arrow
        this.drawArrow();
    }

    // Draw arrow
    drawArrow() {
        // Calculate arrow position - now attached to the wheel edge
        const arrowRadius = this.wheelRadius; // Position at the edge of the wheel
        const arrowX = this.centerX;
        const arrowY = this.centerY - arrowRadius;
        
        // Draw only a triangle arrow
        this.ctx.beginPath();
        this.ctx.moveTo(arrowX, arrowY + 10); // Bottom point
        this.ctx.lineTo(arrowX + 8, arrowY); // Right point
        this.ctx.lineTo(arrowX - 8, arrowY); // Left point
        this.ctx.closePath();
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fill();
        this.ctx.stroke();
    }

    // Draw wheel with names
    drawWheel() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.names.length === 0) {
            this.drawEmptyWheel();
            return;
        }
        
        const sliceAngle = (2 * Math.PI) / this.names.length;
        
        // Draw slices
        for (let i = 0; i < this.names.length; i++) {
            const startAngle = i * sliceAngle + this.currentRotation;
            const endAngle = startAngle + sliceAngle;

            // Draw slice
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.arc(this.centerX, this.centerY, this.wheelRadius, startAngle, endAngle);
            this.ctx.closePath();
            
            // Set color
            const name = this.names[i];
            const isWinner = this.winners.includes(name);
            this.ctx.fillStyle = isWinner ? '#95a5a6' : this.colors[i % this.colors.length];
            
            this.ctx.fill();
            this.ctx.stroke();

            // Draw text
            this.ctx.save();
            this.ctx.translate(this.centerX, this.centerY);
            this.ctx.rotate(startAngle + sliceAngle / 2);
            this.ctx.textAlign = 'right';
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '16px Arial';
            
            // Add checkmark to winners
            const displayText = isWinner ? `${name} ✓` : name;
            this.ctx.fillText(displayText, this.wheelRadius - 10, 5);
            this.ctx.restore();
        }

        // Draw center
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 20, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw arrow
        this.drawArrow();
    }

    // Get name at arrow position - COMPLETELY REWRITTEN
    getNameAtArrow() {
        if (this.names.length === 0) return null;
        
        // COMPLETELY NEW APPROACH: Instead of trying to calculate the name at the arrow,
        // we'll use a visual approach by drawing a line from the center to the arrow
        // and checking which slice it intersects with
        
        // Create a temporary canvas to draw the line
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Draw the wheel on the temporary canvas
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        const sliceAngle = (2 * Math.PI) / this.names.length;
        
        // Draw slices
        for (let i = 0; i < this.names.length; i++) {
            const startAngle = i * sliceAngle + this.currentRotation;
            const endAngle = startAngle + sliceAngle;

            // Draw slice
            tempCtx.beginPath();
            tempCtx.moveTo(this.centerX, this.centerY);
            tempCtx.arc(this.centerX, this.centerY, this.wheelRadius, startAngle, endAngle);
            tempCtx.closePath();
            
            // Set color
            const name = this.names[i];
            const isWinner = this.winners.includes(name);
            tempCtx.fillStyle = isWinner ? '#95a5a6' : this.colors[i % this.colors.length];
            
            tempCtx.fill();
            tempCtx.stroke();
        }
        
        // Draw a line from the center to the arrow
        tempCtx.beginPath();
        tempCtx.moveTo(this.centerX, this.centerY);
        tempCtx.lineTo(this.centerX, this.centerY - this.wheelRadius - 50);
        tempCtx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        tempCtx.lineWidth = 5;
        tempCtx.stroke();
        
        // Get the pixel data at the arrow position
        const arrowX = this.centerX;
        const arrowY = this.centerY - this.wheelRadius - 30;
        const pixelData = tempCtx.getImageData(arrowX - 5, arrowY - 5, 10, 10).data;
        
        // Check which slice the arrow is pointing to
        for (let i = 0; i < this.names.length; i++) {
            const startAngle = i * sliceAngle + this.currentRotation;
            const endAngle = startAngle + sliceAngle;
            
            // Calculate the angle of the arrow
            const arrowAngle = Math.atan2(arrowY - this.centerY, arrowX - this.centerX);
            
            // Normalize the arrow angle to be between 0 and 2π
            let normalizedArrowAngle = arrowAngle;
            if (normalizedArrowAngle < 0) normalizedArrowAngle += 2 * Math.PI;
            
            // Normalize the start and end angles to be between 0 and 2π
            let normalizedStartAngle = startAngle % (2 * Math.PI);
            if (normalizedStartAngle < 0) normalizedStartAngle += 2 * Math.PI;
            
            let normalizedEndAngle = endAngle % (2 * Math.PI);
            if (normalizedEndAngle < 0) normalizedEndAngle += 2 * Math.PI;
            
            // Check if the arrow is within this slice
            if (normalizedStartAngle <= normalizedArrowAngle && normalizedArrowAngle <= normalizedEndAngle) {
                return this.names[i];
            }
        }
        
        // If we couldn't determine the slice, use a fallback method
        const sliceAngle2 = (2 * Math.PI) / this.names.length;
        let normalizedRotation = this.currentRotation % (2 * Math.PI);
        if (normalizedRotation < 0) normalizedRotation += 2 * Math.PI;
        
        // Calculate which slice is at the top (0 radians)
        const nameIndex = Math.floor(normalizedRotation / sliceAngle2) % this.names.length;
        
        return this.names[nameIndex];
    }

    // Get names from input or Google Sheet
    async getNames() {
        const manualNames = document.getElementById('manualNames').value;
        const sheetLink = document.getElementById('sheetLink').value;
        
        // Check if manual names are provided
        if (manualNames.trim() !== '') {
            this.names = manualNames.split('\n')
                .map(name => name.trim())
                .filter(name => name !== '');
            
            if (this.names.length === 0) {
                alert('Please enter at least one name.');
                return false;
            }
            
            return true;
        }
        
        // If no manual names, try Google Sheet
        if (!sheetLink) {
            alert('Please enter names manually or provide a Google Sheet link.');
            return false;
        }

        try {
            // Extract the sheet ID from the URL
            let sheetId;
            
            // Handle different Google Sheets URL formats
            if (sheetLink.includes('/d/')) {
                // Format: https://docs.google.com/spreadsheets/d/SHEET_ID/edit
                const match = sheetLink.match(/\/d\/([a-zA-Z0-9-_]+)/);
                if (match) sheetId = match[1];
            } else if (sheetLink.includes('/spreadsheets/d/')) {
                // Format: https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=0
                const match = sheetLink.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
                if (match) sheetId = match[1];
            } else {
                // Assume it's just the ID
                const match = sheetLink.match(/[a-zA-Z0-9-_]{20,}/);
                if (match) sheetId = match[0];
            }
            
            if (!sheetId) {
                alert('Invalid Google Sheet link. Please enter names manually.');
                return false;
            }

            console.log('Extracted sheet ID:', sheetId);
            
            // Use a CORS proxy to access the Google Sheet
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`)}`;
            
            console.log('Fetching from proxy URL:', proxyUrl);
            
            const response = await fetch(proxyUrl);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.text();
            console.log('Received data length:', data.length);
            
            // Parse CSV data (assuming names are in the first column)
            this.names = data.split('\n')
                .map(row => {
                    const columns = row.split(',');
                    return columns[0] ? columns[0].trim() : '';
                })
                .filter(name => name !== '');
            
            console.log('Extracted names:', this.names);

            if (this.names.length === 0) {
                alert('No names found in the sheet. Please enter names manually.');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error fetching sheet:', error);
            
            // Provide detailed instructions for fixing the issue
            const instructions = `
Error accessing Google Sheet. This is likely due to browser security restrictions.

Please use the manual input option above to enter names directly:

1. Enter each name on a new line in the text area
2. Make sure there are no empty lines
3. Click "Start Raffle" when you're ready

This is the most reliable way to use the raffle wheel.
`;
            
            alert(instructions);
            return false;
        }
    }

    // COMPLETELY NEW APPROACH: Spin the wheel
    async spin() {
        if (this.isSpinning) return;
        this.isSpinning = true;

        // Get number of extractions
        const extractions = parseInt(document.getElementById('extractions').value);
        if (isNaN(extractions) || extractions < 1) {
            alert('Please enter a valid number of extractions');
            this.isSpinning = false;
            return;
        }

        // Get names
        const success = await this.getNames();
        if (!success) {
            this.isSpinning = false;
            return;
        }

        // Reset winners
        this.winners = [];
        const winnersList = document.getElementById('winnersList');
        winnersList.innerHTML = '';

        // Draw initial wheel
        this.drawWheel();

        // Create copy of names for selection
        const availableNames = [...this.names];

        // Perform extractions
        for (let i = 0; i < extractions; i++) {
            if (availableNames.length === 0) {
                alert('All names have been selected!');
                break;
            }

            // COMPLETELY NEW APPROACH: Instead of selecting a winner and then rotating,
            // we'll rotate the wheel first and then select the winner based on where it lands
            
            // Calculate how many full rotations (5-10)
            const fullRotations = 5 + Math.floor(Math.random() * 5);
            
            // Calculate a random final position
            const randomAngle = Math.random() * 2 * Math.PI;
            
            // The final rotation will be:
            // currentRotation + (fullRotations * 2π) + randomAngle
            const targetRotation = this.currentRotation + (fullRotations * 2 * Math.PI) + randomAngle;
            
            // Animate
            const duration = 3000; // 3 seconds
            const startTime = performance.now();
            const startRotation = this.currentRotation;

            await new Promise(resolve => {
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Simple easing
                    const easeOut = (t) => 1 - Math.pow(1 - t, 2);
                    
                    // Update rotation
                    this.currentRotation = startRotation + (targetRotation - startRotation) * easeOut(progress);
                    this.drawWheel();

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        // Get the name at the arrow
                        const nameAtArrow = this.getNameAtArrow();
                        
                        // This is the winner!
                        if (nameAtArrow) {
                            // Check if the name is still available
                            const index = availableNames.indexOf(nameAtArrow);
                            
                            if (index > -1) {
                                // Remove from available names
                                availableNames.splice(index, 1);
                                
                                // Add to winners
                                this.winners.push(nameAtArrow);
                                const li = document.createElement('li');
                                // Add number to the winner (i+1 because i is 0-based)
                                li.textContent = `${i+1}. 🎉 ${nameAtArrow} - Congratulations!`;
                                winnersList.appendChild(li);
                                
                                this.drawWheel();
                            } else {
                                // If the name is not in availableNames, it means it was already selected
                                // We need to try again with a different rotation
                                console.log(`Name ${nameAtArrow} was already selected, trying again...`);
                                // Force a new random rotation
                                this.currentRotation += Math.PI / 2;
                                this.drawWheel();
                                // Get a new winner
                                const newNameAtArrow = this.getNameAtArrow();
                                if (newNameAtArrow && availableNames.includes(newNameAtArrow)) {
                                    const newIndex = availableNames.indexOf(newNameAtArrow);
                                    availableNames.splice(newIndex, 1);
                                    this.winners.push(newNameAtArrow);
                                    const li = document.createElement('li');
                                    li.textContent = `${i+1}. 🎉 ${newNameAtArrow} - Congratulations!`;
                                    winnersList.appendChild(li);
                                    this.drawWheel();
                                }
                            }
                        }

                        resolve();
                    }
                };

                requestAnimationFrame(animate);
            });
            
            // Small delay between extractions
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        this.isSpinning = false;
    }

    // Start raffle
    async startRaffle() {
        await this.spin();
    }
}

// Initialize on load
window.addEventListener('load', () => {
    new RaffleWheel();
}); 