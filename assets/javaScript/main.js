document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('dbConnectionForm');
            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
          
          
        
          
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
            if(dbError){
                  errorMessage.style.display = 'block';
            }
           
         
            const formInputs = document.querySelectorAll('.form-control');
            formInputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    this.parentElement.parentElement.classList.remove('focused');
                });
            });
            
            // Add a subtle animation to the form container on load
            const formContainer = document.querySelector('.form-container');
            formContainer.style.opacity = '0';
            formContainer.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                formContainer.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                formContainer.style.opacity = '1';
                formContainer.style.transform = 'translateY(0)';
            }, 300);
        });