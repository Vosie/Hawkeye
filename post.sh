#!/bin/bash
echo "upload file $1, $2, $3, $4, $5, $6 to $7";
curl --form k=$1 --form c=$2 --form l=$3 --form t=$4 --form file=@$5 --form e=$6 $7
