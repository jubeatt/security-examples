<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>Demo</h1>

    <!-- online demo: https://phpsandbox.io/n/payload-in-js-demo-cmnde -->
    <!-- solution1: " alert(1) // -->
    <!-- solution1: </script><img src="x" onerror="alert(1)" /> -->

    <script>
      const name = "<?php $_GET['name'] ?>"
      alert(name)
    </script>
  </body>
</html>
