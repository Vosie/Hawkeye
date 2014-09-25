#!/bin/bash
echo "mark error $1, $2, $3, $4, $5, $6";
curl --form k=$1 --form c=$2 --form l=$3 --form t=$4 --form e=$5 $6
