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

    <nav class="navbar navbar-expand-lg navbar-light bg-light">

        <div class="d-flex justify-content-between w-100">
            <a class="navbar-brand" href="#"> <img width=75 height=60 src='../front-end/images/logo.png'>
            </a>

            <div class="collapse navbar-collapse d-flex justify-content-end" id="navbarNavDropdown">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <ul class="navbar-nav">
                    <li class="nav-item active">
                        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Pending Reports</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">In Progress Reports</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Completed Reports</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">
                            Profile
                        </a>
                        <div class="dropdown-menu nav-dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <a class="dropdown-item" href="#">View profile</a>
                            <a class="dropdown-item" href="#">Settings</a>

                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item text-danger" href="#">Logout</a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </nav>



    <section id="in-progress">
        <div class="container">
            <div class="d-flex justify-content-between mt-4">
                <h4>In Progress Reports</h4>
                <!-- Example single danger button -->
                <div class="btn-group">
                    <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        Sort by
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#">Location</a>
                        <a class="dropdown-item" href="#">Severity</a>
                        <a class="dropdown-item" href="#">Latest</a>
                        <a class="dropdown-item" href="#">Oldest</a>
                    </div>
                </div>
            </div>



            <div class="card-deck mt-2">
                <div class="card">
                    <img class="card-img-top" src="./images/istockphoto-174662203-612x612.jpg" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">Report #1</h5>
                        <p class="m-0">Status: <span class="">In progress</span></p>
                        <p class="card-text">Severity: <span>4</span></p>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-secondary">View</button>
                        </div>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted">Last updated 3 mins ago</small>
                    </div>
                </div>
                <div class="card">
                    <img class="card-img-top" src="./images/istockphoto-174662203-612x612.jpg" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">Report #2</h5>
                        <p class="m-0">Status: <span>In progress</span></p>
                        <p class="card-text">Severity: <span>4</span></p>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-secondary">View</button>
                        </div>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted">Last updated 3 mins ago</small>
                    </div>
                </div>
                <div class="card">
                    <img class="card-img-top" src="./images/istockphoto-174662203-612x612.jpg" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">Report #3</h5>
                        <p class="m-0">Status: <span>In progress</span></p>
                        <p class="card-text">Severity: <span>4</span></p>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-secondary">View</button>
                        </div>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted">Last updated 3 mins ago</small>
                    </div>
                </div>
            </div>
        </div>

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