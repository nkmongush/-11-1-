document.addEventListener('DOMContentLoaded', function () {
    const currentPath = window.location.pathname;
    const profileSlide = document.getElementById('profile-slide');
    const nameDiv = document.getElementById('name');
    const dateDiv = document.getElementById('date');
    const genderDiv = document.getElementById('gender');
    const registrationModal = document.getElementById('registrationModal');
    const registrationForm = document.getElementById('registrationForm');
    const editForm = document.getElementById('editForm');
    const editNameInput = document.getElementById('editName');
    const editDateInput = document.getElementById('editDate');
    const editGenderMale = document.getElementById('editGenderMale');
    const editGenderFemale = document.getElementById('editGenderFemale');
    const galleryImages = document.querySelector('.gallery-images');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    let images;
    let currentIndex = 0;
    let checkTestButton, resetTestButton, quizDiv, resultsDiv;

    function showCustomError(message, element) {
        if (!element) {
            console.error("Element is null, cannot show custom error:", message);
            return;
        }
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        element.parentNode.insertBefore(errorElement, element.nextSibling);
        setTimeout(() => errorElement.remove(), 5000);
    }

    function showCustomSuccess(message, element) {
        const successElement = document.createElement('div');
        successElement.classList.add('custom-success');
        successElement.textContent = message;
        element.parentNode.insertBefore(successElement, element);
        setTimeout(() => successElement.remove(), 3000);
    }


    function handleRegistrationFormSubmission(event) {
        event.preventDefault();
        const nameInput = document.getElementById("nameInput");
        const dateInput = document.getElementById("dateInput");
        const genderInput = document.querySelector('input[name="gender"]:checked');
        const nameError = document.getElementById("nameError");
        const dateError = document.getElementById("dateError");
        const genderError = document.getElementById("genderError");
        nameError.textContent = "";
        dateError.textContent = "";
        genderError.textContent = "";
        let isValid = true;

        if (!nameInput.value) {
            nameError.textContent = "Пожалуйста, введите имя.";
            isValid = false;
        }
        if (!dateInput.value) {
            dateError.textContent = "Пожалуйста, введите дату рождения.";
            isValid = false;
        }
        if (!genderInput) {
            genderError.textContent = "Пожалуйста, выберите пол.";
            isValid = false;
        }

        if (isValid) {
            const formData = new FormData(registrationForm);
            const name = formData.get('name');
            const date = formData.get('date');
            const gender = formData.get('gender');
            localStorage.setItem('registrationData', JSON.stringify({ name, date, gender }));
            registrationModal.style.display = 'none';
            if (currentPath.includes('profile.html')) {
                updateProfileDisplay();
            }
            showCustomSuccess("Регистрация прошла успешно!", registrationForm);
        }
    }



    function updateProfileDisplay() {
        if (!profileSlide || !nameDiv || !dateDiv || !genderDiv) {
            console.error("Profile elements not found.");
            return;
        }
        try {
            const registrationData = localStorage.getItem('registrationData');
            if (registrationData) {
                const data = JSON.parse(registrationData);
                if (data && data.name) nameDiv.textContent = `Имя: ${data.name}`;
                if (data && data.date) dateDiv.textContent = `Дата рождения: ${data.date}`;
                if (data && data.gender) genderDiv.textContent = `Пол: ${data.gender}`;
                profileSlide.style.display = 'block';
            } else {
                profileSlide.style.display = 'none';
            }
        } catch (error) {
            showCustomError("Ошибка при загрузке данных профиля.", profileSlide);
            console.error("Error parsing registration data:", error);
        }
    }

    function updateGallery() {
        try {
            images = galleryImages.querySelectorAll('img');
            if (!images || images.length === 0) {
                console.error("No images found in the gallery.");
                return;
            }

            const offset = -currentIndex * 100; // Расчет сдвига

            images.forEach((img) => {
                img.style.opacity = 0; // Сначала скрываем все
            });

            images[currentIndex].style.opacity = 1; // Показываем текущее изображение

            galleryImages.style.transform = `translateX(${offset}%)`;

            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === (images.length - 1);
        } catch (error) {
            showCustomError('Ошибка при обновлении галереи.', galleryImages);
        }
    }



    if (galleryImages && prevButton && nextButton) {
        images = galleryImages.querySelectorAll('img');
        updateGallery();

        prevButton.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 1);
            updateGallery();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = Math.min(images.length - 1, currentIndex + 1);
            updateGallery();
        });
    }



    if (currentPath.includes('profile.html')) {
        if (registrationForm) {
            registrationForm.addEventListener('submit', handleRegistrationFormSubmission);
        }
        const editProfileButton = document.getElementById('editProfile');
        if (editProfileButton) {
            editProfileButton.addEventListener('click', function () {
                profileSlide.style.display = 'none';
                editForm.style.display = 'block';
            });
        }
        if (editForm) {
            editForm.addEventListener('submit', function (event) {
                event.preventDefault();
                const name = editNameInput.value;
                const date = editDateInput.value;
                let gender = 'не указан';
                if (editGenderMale.checked) gender = 'мужской';
                if (editGenderFemale.checked) gender = 'женский';
                const registrationData = { name, date, gender };
                localStorage.setItem('registrationData', JSON.stringify(registrationData));
                updateProfileDisplay();
                editForm.style.display = 'none';
                profileSlide.style.display = 'block';
                showCustomSuccess("Профиль изменён!", editForm);
            });
        }
        updateProfileDisplay();
    }
    if (currentPath.includes('test.html')) {
        quizDiv = document.getElementById('quiz');
        resultsDiv = document.getElementById('results');
        checkTestButton = document.getElementById('checkTestButton');
        resetTestButton = document.getElementById('resetTestButton');
        if (checkTestButton) {
            checkTestButton.addEventListener('click', handleCheckTest);
        }
        if (resetTestButton) {
            resetTestButton.addEventListener('click', handleResetTest);
            resetTestButton.style.display = 'none';
        }
    }

    function handleCheckTest(event) {
        event.preventDefault();
        if (!quizDiv || !resultsDiv) {
            showCustomError("Ошибка: Элементы quiz и results не найдены!", quizDiv);
            return;
        }
        resultsDiv.innerHTML = '';
        const answers = {
            q1: 'солдат-76',
            q2: 'молот, щит, рывок',
            q3: 'C',
            q4: 'A',
            q5: 'D',
            q6: 'A'
        };
        let score = 0;
        let feedback = '';
        for (let i = 1; i <= 6; i++) {
            const question = `q${i}`;
            let userAnswer;
            if (question === 'q1' || question === 'q2') {
                userAnswer = quizDiv.querySelector(`input[name="${question}"]`).value?.toLowerCase();
            } else {
                userAnswer = quizDiv.querySelector(`input[name="${question}"]:checked`)?.value;
            }

            if (userAnswer) {
                if (question === 'q1' || question === 'q2') {
                    if (userAnswer.includes(answers[question].toLowerCase())) {
                        score++;
                        feedback += `<p>Вопрос ${i}: Верно!</p>`;
                    } else {
                        feedback += `<p>Вопрос ${i}: Неверно. Правильный ответ: ${answers[question]}</p>`;
                    }
                } else {
                    if (userAnswer === answers[question]) {
                        score++;
                        feedback += `<p>Вопрос ${i}: Верно!</p>`;
                    } else {
                        feedback += `<p>Вопрос ${i}: Неверно. Правильный ответ: ${answers[question]}</p>`;
                    }
                }
            } else {
                feedback += `<p>Вопрос ${i}: Не был дан ответ</p>`;
            }
        }
        resultsDiv.innerHTML = `<h2>Ваш результат: ${score} из 6</h2>${feedback}`;
        if (checkTestButton) {
            checkTestButton.style.display = 'none';
        }
        if (resetTestButton) {
            resetTestButton.style.display = 'block';
        }
    }

    function handleResetTest(event) {
        event.preventDefault();
        if (!quizDiv || !resultsDiv) {
            showCustomError('Невозможно найти элементы теста.', quizDiv);
            return;
        }
        resultsDiv.innerHTML = '';
        const inputs = quizDiv.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type === 'radio') input.checked = false;
            else if (input.type === 'text') input.value = '';
        });
        if (checkTestButton) {
            checkTestButton.style.display = 'block';
        }
        if (resetTestButton) {
            resetTestButton.style.display = 'none';
        }
    }

    if (currentPath.includes('glossary.html')) {
        const searchInput = document.getElementById('search-term');
        const searchButton = document.getElementById('search-button');
        const endSearchButton = document.getElementById('end-search-button');
        const glossaryItems = document.querySelectorAll('#glossary-list li');
        if (searchButton && endSearchButton && searchInput) {
            searchButton.addEventListener('click', handleSearch);
            endSearchButton.addEventListener('click', handleEndSearch);
        }
        function handleSearch() {
            try {
                const searchTerm = searchInput.value.toLowerCase();
                glossaryItems.forEach(item => {
                    const term = item.querySelector('.term')?.textContent?.toLowerCase();
                    item.style.display = term?.includes(searchTerm) ? 'flex' : 'none';
                });
                searchButton.style.display = 'none';
                endSearchButton.style.display = 'inline-block';
            } catch (error) {
                showCustomError('Ошибка при поиске терминов.', searchButton);
            }
        }

        function handleEndSearch() {
            try {
                searchInput.value = '';
                glossaryItems.forEach(item => {
                    item.style.display = 'flex';
                });
                searchButton.style.display = 'inline-block';
                endSearchButton.style.display = 'none';
            } catch (error) {
                showCustomError('Ошибка при завершении поиска.', searchButton);
            }
        }
    }

    // Проверка наличия данных регистрации при загрузке любой страницы
    const registrationData = localStorage.getItem('registrationData');
    if (!registrationData) {
        if (registrationModal) {
            registrationModal.style.display = 'block';
            if (registrationForm) {
                registrationForm.addEventListener('submit', handleRegistrationFormSubmission);
            }
        }
    }
    if (currentPath.includes('profile.html')) {
        updateProfileDisplay();
    }
});