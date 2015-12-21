 <script type="text/javascript">
            function postToGoogle() {
                var field1 = $("input[type='radio'][name='qs1']:checked").val();
                var field2 = $("input[type='radio'][name='qs2']:checked").val();
                var field3 = $('#feed').val();
 
                $.ajax({
                    url: "https://docs.google.com/forms/d/FORM_KEY/formResponse",
                    data: {"entry.1023121230": field3, "entry.1230072460": field1, "entry.2113237615": field2},
                    type: "POST",
                    dataType: "xml",
                    statusCode: {
                        0: function() {
                            //Success message
                        },
                        200: function() {
                            //Success Message
                        }
                    }
                });
            }
             
            $(document).ready(function(){
                $('#form').submit(function() {
                    postToGoogle();
                    return false;
                });
            });
        </script>