const searchBtn = document.getElementById('search-btn');
const uploadBtn = document.getElementById('upload-btn');

const apigClient = apigClientFactory.newClient();


function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support voice recognition. Please use a supported browser like Google Chrome.');
      return;
    }
  
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.onresult = (event) => {
      const query = event.results[0][0].transcript;
      document.getElementById('search-query').value = query;
      performSearch(query);
    };
  
    recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
    };
  
    recognition.start();
  }

  function performSearch(query) {
    // Encode the query to ensure special characters are handled correctly in the URL
    const encodedQuery = encodeURIComponent(query);
    const params = { q: encodedQuery };
    const additionalParams = {
        headers: {
            'x-api-key': 'SF4HWtJK2laqWpI8Oll459AyGwEEAvQtauktC6Zf'
        }
    };

    console.log('Search request:', `/search?q=${encodedQuery}`);

    apigClient.searchGet(params, null, additionalParams)
        .then(function(result) {
            console.log('API Response:', result.data);
            const gallery = document.getElementById('gallery');
            gallery.innerHTML = '';

            // Update this line to access the 'results' property in the response object
            result.data.results.forEach(photo => {
                // Update this line to use the 'url' property of the Photo object
                const img = document.createElement('img');
                img.src = photo.url;
                gallery.appendChild(img);
            });
        })
        .catch(function(result) {
            console.error('Error:', result);
        });
}


  /*
  function performSearch(query) {
    console.log("In the search function")
    const encodedQuery = encodeURIComponent(query);
    const params = { q: encodedQuery };
    const additionalParams = {
      headers: {
        'x-api-key': 'SF4HWtJK2laqWpI8Oll459AyGwEEAvQtauktC6Zf'
      }
    };
  
    console.log('Search request:', `/search?q=${encodedQuery}`);
     
  
    apigClient.searchGet(params, additionalParams)
      .then(function(result) {
        console.log('API Response:', result.data);
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';
        
        // Update this line to access the 'results' property in the response object
        result.data.results.forEach(photo => {
          // Update this line to use the 'url' property of the Photo object
          const img = document.createElement('img');
          img.src = photo.url;
          gallery.appendChild(img);
        });
      })
      .catch(function(result) {
        console.error('Error:', result);
      });
  }
  */

  
  searchBtn.addEventListener('click', () => {
    const query = document.getElementById('search-query').value;
    performSearch(query);
  });

  const voiceSearchBtn = document.getElementById('voice-search-btn');
voiceSearchBtn.addEventListener('click', startVoiceRecognition);


uploadBtn.addEventListener('click', () => {
    const fileInput = document.getElementById('upload-photo');
    const customLabels = document.getElementById('custom-labels').value;
    const file = fileInput.files[0];
    const params = {
        'x-amz-meta-customLabels': customLabels.replace(/\s/g, '').trim(),
        'filename': file.name,
        'Content-Type': 'text/64',
    };

    reader = new FileReader();
    reader.readAsDataURL(file); // myfile is a type file object
    reader.onload = function() {
      console.log(reader.result)
      const file_as_base64 = reader.result.split(";base64,")[1]
      apigClient.uploadFilenamePut(params, file_as_base64)
            .then(function(response) {
                if (response.status === 200) {
                    console.log(response);
                    alert('Photo uploaded successfully!');
                } else {
                    alert('Failed to upload the photo');
                }
            })
            .catch(function(error) {
                console.error('Error:', error);
            });
     };
     reader.onerror = function() {
       console.log(reader.error);
     };

    
});
