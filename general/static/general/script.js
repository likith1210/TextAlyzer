var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

window.onload = (event) => {
    self.resizeTo(600,400);
    var current = 0;
    for (var i = 0; i < document.links.length; i++) {
        if (document.links[i].href === document.URL) {
            current = i;
        }
    }
    document.links[current].className += ' now';

    switch(document.URL){
        case 'http://127.0.0.1:8000/':
            var btn0 = document.getElementsByClassName('box')[0];
            var btn1 = document.getElementsByClassName('box')[1];
            var btn2 = document.getElementsByClassName('box')[2];
            var cls = document.getElementsByClassName('close')[0];

            btn0.onclick = (event) => {
                document.getElementsByClassName('name')[0].innerHTML = '<h1>Higher Accuracy</h1>';
                document.getElementsByClassName('btm')[0].innerHTML = '<p>- Pin-point accuracy while summarizing and answering.</p><p>- Human analysis have higher probability of missing out important phrases.</p><p>- Uses keywords and structure of the sentence to attain greater accurancy. </p>';
                document.getElementsByClassName('layout')[0].style.display = 'block';
            };

            btn1.onclick = (event) => {
                document.getElementsByClassName('name')[0].innerHTML = '<h1>Greater Effeciency</h1>';
                document.getElementsByClassName('btm')[0].innerHTML = '<p>- Much faster than manual searching.</p><p>- Error-free and faster analysis.</p><p>- Handle large amount of data.</p>';
                document.getElementsByClassName('layout')[0].style.display = 'block';
            };

            btn2.onclick = (event) => {
                document.getElementsByClassName('name')[0].innerHTML = '<h1>Faster Analysis</h1>';
                document.getElementsByClassName('btm')[0].innerHTML = '<p>- Supports multiple input file formats.</p><p>- Accessible through any device.</p><p>- User friendly interface.</p>';
                document.getElementsByClassName('layout')[0].style.display = 'block';
            };

            cls.onclick = (event) => {
                document.getElementsByClassName('layout')[0].style.display = 'none';   
            }
            break;

        case 'http://127.0.0.1:8000/summary':
            var file = document.getElementsByClassName('file')[0];
            var res = document.getElementsByClassName('sum_txtbox')[0];

            file.onchange = (event) => {
                var fileToLoad = file.files[0];
                var fileReader = new FileReader();
                fileReader.onload = function(fileLoadedEvent){
                    var textFromFileLoaded = fileLoadedEvent.target.result;
                    res.value = textFromFileLoaded;
                };

                fileReader.readAsText(fileToLoad);

            }

            var btn = document.getElementsByClassName('sum_btn')[0];
            var res = document.getElementsByClassName('sum_txtbox')[0];
            var summ = document.getElementsByClassName('sum_txtbox')[1];
            var count = document.getElementsByClassName('count')[0];

            btn.onclick = (event) => {
                var text = res.value;
                var l = document.getElementById('len').value;

                $.ajax({
                        type: 'POST',
                        url: "/summary",
                        data: {
                            "data": text,
                            "len": l
                            },
                        success: function (response) {
                            summ.value = response['sum'];
                            count.innerHTML = 'Words : '+ response['sum'].split(" ").length;
                        }
                    })
            }
            break;

        case 'http://127.0.0.1:8000/answer':
            console.log('Hi');
            var file = document.getElementsByClassName('file')[0];
            var res = document.getElementsByClassName('sum_txtbox')[0];
            file.onchange = (event) => {
                var fileToLoad = file.files[0];
                var fileReader = new FileReader();
                fileReader.onload = function(fileLoadedEvent){
                    var textFromFileLoaded = fileLoadedEvent.target.result;
                    res.value = textFromFileLoaded;
                };

                fileReader.readAsText(fileToLoad);
            }

            var bt = document.getElementsByClassName('sum_btn')[0];
            var res = document.getElementsByClassName('sum_txtbox')[0];
            var ques = document.getElementsByClassName('ques_txt')[0];
            var ans = document.getElementsByClassName('ques_txt')[1];

            bt.onclick = (event) => {
                var text = res.value;
                var que = ques.value;

                $.ajax({
                        type: 'POST',
                        url: "/answer",
                        data: {
                            "data": text,
                            "ques": que
                        },
                        success: function (response) {
                            ans.value = response['ans'];
                        }
                    })
            }
    }
};