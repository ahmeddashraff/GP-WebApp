<?php



if($_SERVER['REQUEST_METHOD'] == "POST" && $_POST){



}
    


 ?>




<!doctype html>
<html lang="en">

<head>
    <title>Title</title>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="../front-end/css/style.css">
</head>

<body>

    <nav class="text-center d-flex justify-content-left">
        <div class="position-relative">
            <img width=150 height=120 src='../front-end/images/logo.png'>
            <h3>MyWay</h3>
        </div>
    </nav>


    <section id="login">
        <div class="text-center">
            <h1>Sign in to</h1>
            <h1>MyWay</h1>
        </div>
        <div class="form-group w-25">
            <form method="post">
                <h3>Sign in</h3>
                <input type="text" class="form-control mb-4" name="email" placeholder="Enter Email">
                <input type="password" class="form-control" name="password" placeholder="Enter Password">
                <div class="d-flex justify-content-end">
                    <a class="" href='home.php'>Forgot password ?</a>
                </div>
                <button type="button" class="btn mt-5 w-100 py-2">login</button>
            </form>

        </div>
    </section>

    <section id="footer">
        <img width="600" height="250" src="../front-end/images/road-frontline-sodera-4.png">
    </section>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous">
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
        integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous">
    </script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
        integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous">
    </script>
</body>

</html>