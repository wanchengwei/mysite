<?php

header('Content-type:text/html;charset=utf-8');
$appkey = "e0605699b212510bc6806f03509e2342";

$url = "http://v.juhe.cn/toutiao/index";
$params = array(
      "key" => $appkey,
      "type" => $_GET['type'],
      // "page" => $_GET['page'],
      // "num" => $_GET['num'],
);
$paramstring = http_build_query($params);
$content = juhecurl($url,$paramstring);
$result = json_decode($content,true);
if($result){
    if($result['error_code']=='0'){
        print_r(json_encode($result,JSON_UNESCAPED_UNICODE));
    }else{
        echo $result['reason'].":".$result['error_code'];
    }
}else{
    echo "请求失败";
}

function juhecurl($url,$params=false,$ispost=0){
    $httpInfo = array();
    $ch = curl_init();

    curl_setopt( $ch, CURLOPT_HTTP_VERSION , CURL_HTTP_VERSION_1_1 );
    curl_setopt( $ch, CURLOPT_USERAGENT , 'JuheData' );
    curl_setopt( $ch, CURLOPT_CONNECTTIMEOUT , 60 );
    curl_setopt( $ch, CURLOPT_TIMEOUT , 60);
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER , true );
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    if( $ispost )
    {
        curl_setopt( $ch , CURLOPT_POST , true );
        curl_setopt( $ch , CURLOPT_POSTFIELDS , $params );
        curl_setopt( $ch , CURLOPT_URL , $url );
    }
    else
    {
        if($params){
            curl_setopt( $ch , CURLOPT_URL , $url.'?'.$params );
        }else{
            curl_setopt( $ch , CURLOPT_URL , $url);
        }
    }
    $response = curl_exec( $ch );
    if ($response === FALSE) {
        return false;
    }
    $httpCode = curl_getinfo( $ch , CURLINFO_HTTP_CODE );
    $httpInfo = array_merge( $httpInfo , curl_getinfo( $ch ) );
    curl_close( $ch );
    // echo json_encode(str_replace('"',"'",$response),JSON_UNESCAPED_UNICODE);
    return $response;
}
