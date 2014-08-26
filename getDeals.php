<?php
    header('Content-Type:text/plain');
    echo file_get_contents('http://store.steampowered.com/sale/Weeklong_Deals');
?>