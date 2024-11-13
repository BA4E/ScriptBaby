package main

import (
	"io"
	"log"
	"os"
	"strings"
)

func ReadFromFile(filename string) string {
	file, err := os.OpenFile(filename, os.O_RDONLY, os.ModePerm)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	var s = make([]byte, 0)

	var b = make([]byte, 2)

	for {
		_, err := file.Read(b)
		if err != nil {
			if err == io.EOF {
				break
			}
			log.Fatal(err)
		}
		s = append(s, b...)
	}
	return string(s)
}

func WriteToFile(filename string, data string) {
	file, err := os.OpenFile(filename, os.O_WRONLY|os.O_CREATE, os.ModePerm)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	_, err = file.Write([]byte(data))
	if err != nil {
		log.Fatal(err)
	}
}

func Blank(str string) string {
	if strings.Contains(str, "\\n") {
		return strings.Replace(str, "\\n", "\n", -1)
	}

	return str
}

func main() {
	if len(os.Args) < 4 {
		log.Fatal("Usage: StrReplace.exe <inputFile> <oldstring> <newstring> <outputFile>")
		return
	}
	inputFile := os.Args[1]
	old := os.Args[2]
	new := Blank(os.Args[3])

	outputFile := os.Args[4]

	content := ReadFromFile(inputFile)

	replace := strings.Replace(content, old, new, -1)

	WriteToFile(outputFile, replace)
}
