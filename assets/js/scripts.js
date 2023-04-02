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
     
    apigClient.addRequestInterceptor(function(request) {
        request.headers['x-api-key'] = 'SF4HWtJK2laqWpI8Oll459AyGwEEAvQtauktC6Zf';
        return request;
    });
      
  
    apigClient.searchGet(params)
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

  function displayImage(base64Image, format) {
    const gallery = document.getElementById("gallery");
    const img = document.createElement("img");
  
    // Add the appropriate data URL prefix based on the image format
    const dataUrlPrefix = `data:image/${format};base64,`;
    img.src = dataUrlPrefix + base64Image;
  
    gallery.appendChild(img);
  }
  
  function performSearch(query) {
    const encodedQuery = encodeURIComponent(query);
    const params = { q: encodedQuery };
  
    console.log("Search request:", `/search?q=${encodedQuery}`);
  
    apigClient.searchGet(params)
      .then(function (result) {
        console.log("API Response:", result.data);
        const gallery = document.getElementById("gallery");
        gallery.innerHTML = "";
  
        // Update this line to access the 'results' property in the response object
        result.data.results.forEach((photo) => {
          // Fetch the base64 encoded image from the pre-signed URL
          fetch(photo.url)
            .then((response) => response.text())
            .then((base64Image) => {
              // Determine the image format (e.g., 'jpeg', 'png') based on the photo.url or another field in the photo object
              const imageFormat = "png"; // Replace this line with the correct logic to determine the image format
              displayImage(base64Image, imageFormat);
            })
            .catch((error) => console.error("Error fetching image:", error));
        });
      })
      .catch(function (result) {
        console.error("Error:", result);
      });
  }
  
  */
  
  
  searchBtn.addEventListener('click', () => {
    const query = document.getElementById('search-query').value;
    performSearch(query);
  });

  const voiceSearchBtn = document.getElementById('voice-search-btn');
voiceSearchBtn.addEventListener('click', startVoiceRecognition);

/*
searchBtn.addEventListener('click', () => {
    const query = document.getElementById('search-query').value;
    const params = { q: query };

    console.log('Search request:', `/search?q=${query}`);

    apigClient.searchGet(params)
        .then(function(result) {
            console.log('API Response:', result.data); 
            const gallery = document.getElementById('gallery');
            console.log('API Response:', result.data); 
            gallery.innerHTML = '';
            result.data.forEach(url => {
                const img = document.createElement('img');
                img.src = url;
                gallery.appendChild(img);
            });
        })
        .catch(function(result) {
            console.error('Error:', result);
        });
});
*/



/*
uploadBtn.addEventListener('click', () => {
    const fileInput = document.getElementById('upload-photo');
    const customLabels = document.getElementById('custom-labels').value;
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const params = {
        'x-amz-meta-customLabels': customLabels.replace(/\s/g, '').trim()
    };

    console.log('Upload request:', {
        method: 'PUT',
        body: formData,
    //    headers: params
    });

    apigClient.uploadPut(params, formData)
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
});

uploadBtn.addEventListener('click', () => {
    const fileInput = document.getElementById('upload-photo');
    const customLabels = document.getElementById('custom-labels').value;
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const params = {
        'x-amz-meta-customLabels': customLabels.replace(/\s/g, '').trim(),
        'filename': fileInput.files[0].name
    };

    console.log('Upload request:', {
        method: 'PUT',
        body: formData,
    //    headers: params
    });

    apigClient.uploadFilenamePut(params, formData)
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
});



uploadBtn.addEventListener('click', () => {
    const fileInput = document.getElementById('upload-photo');
    const customLabels = document.getElementById('custom-labels').value;
    const file = fileInput.files[0];

    const params = {
        'x-amz-meta-customLabels': customLabels.replace(/\s/g, '').trim(),
        'filename': file.name,
        'Content-Type': file.type
    };
    console.log('params:', params)

    const reader = new FileReader();
    reader.onload = function(e) {
        const binaryString = e.target.result;
        apigClient.uploadFilenamePut(params, binaryString)
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
    reader.readAsArrayBuffer(file);
});




uploadBtn.addEventListener('click', () => {
    const fileInput = document.getElementById('upload-photo');
    const customLabels = document.getElementById('custom-labels').value;
    const file = fileInput.files[0];
    const params = {
        'x-amz-meta-customLabels': customLabels.replace(/\s/g, '').trim(),
        'filename': file.name,
        'Content-Type': file.type
    };

    console.log('params:', params)

    const reader = new FileReader();
    reader.onload = function(e) {
        const binaryString = e.target.result;
        const byteArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            byteArray[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: file.type });
        console.log('blob', blob)
        console.log(binaryString)
        apigClient.uploadFilenamePut(params, binaryString)
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
    reader.readAsBinaryString(file);

});

*/

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




/*
uploadBtn.addEventListener('click', () => {
    const fileInput = document.getElementById('upload-photo');
    const customLabels = document.getElementById('custom-labels').value;
    const file = fileInput.files[0];
    const params = {
        'x-amz-meta-customLabels': customLabels.replace(/\s/g, '').trim(),
        'filename': file.name,
        'Content-Type': 'multipart/form-data'
    };

    console.log('params:', params)

    const reader = new FileReader();
    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        const blob = new Blob([arrayBuffer], {type: file.type});
        console.log('Blob', blob);

        apigClient.uploadFilenamePut(params, blob)
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
    reader.readAsArrayBuffer(file);
});
*/
