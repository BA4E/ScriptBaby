package main

import (
	"fmt"
	"github.com/imroc/req/v3"
	"strings"
)

type T struct {
	R string `json:"r"`
	D struct {
		RecordsCount   int `json:"recordsCount"`
		RecordsPerPage int `json:"recordsPerPage"`
		PageIndex      int `json:"pageIndex"`
		TotalPages     int `json:"totalPages"`
		Items          []struct {
			Id                 int         `json:"id"`
			Number             string      `json:"number"`
			Name               string      `json:"name"`
			Model              string      `json:"model"`
			Manufacturer       string      `json:"manufacturer"`
			Introduction       string      `json:"introduction"`
			Application        string      `json:"application"`
			Parameter          string      `json:"parameter"`
			SampleInstructions string      `json:"sampleInstructions"`
			Address            string      `json:"address"`
			Contact            string      `json:"contact"`
			ContactInformation string      `json:"contactInformation"`
			Image              string      `json:"image"`
			StartTime          string      `json:"startTime"`
			EndTime            string      `json:"endTime"`
			Summer1            string      `json:"summer1"`
			Summer2            string      `json:"summer2"`
			Summer3            string      `json:"summer3"`
			Summer4            string      `json:"summer4"`
			Winter1            string      `json:"winter1"`
			Winter2            string      `json:"winter2"`
			Winter3            string      `json:"winter3"`
			Winter4            string      `json:"winter4"`
			Interval           float64     `json:"interval"`
			Status             int         `json:"status"`
			StatusStr          string      `json:"statusStr"`
			Type               int         `json:"type"`
			Time               bool        `json:"time"`
			Package            bool        `json:"package"`
			Sample             bool        `json:"sample"`
			TypeStr            interface{} `json:"typeStr"`
			WordType           int         `json:"wordType"`
			WordTypeStr        string      `json:"wordTypeStr"`
			DeviceCategory     int         `json:"deviceCategory"`
			DeviceCategoryStr  string      `json:"deviceCategoryStr"`
			Remark             string      `json:"remark"`
			Rank               int         `json:"rank"`
			AppointmentTips    string      `json:"appointmentTips"`
			BuyDate            string      `json:"buyDate"`
			RuleId             int         `json:"ruleId"`
			RuleName           interface{} `json:"ruleName"`
			DeviceTypeRuleId   int         `json:"deviceTypeRuleId"`
			DeviceTypeRuleName interface{} `json:"deviceTypeRuleName"`
			WeekIds            interface{} `json:"weekIds"`
			SiteNO             interface{} `json:"siteNO"`
			Cname              interface{} `json:"cname"`
			Ename              interface{} `json:"ename"`
			InnerId            interface{} `json:"innerId"`
			InstrBelongsType   interface{} `json:"instrBelongsType"`
			InstrBelongsName   string      `json:"instrBelongsName"`
			ResourceName       string      `json:"resourceName"`
			InstrCategory      interface{} `json:"instrCategory"`
			InstrSource        interface{} `json:"instrSource"`
			InstrSupervise     string      `json:"instrSupervise"`
			DeclarationNumb    interface{} `json:"declarationNumb"`
			ImportDate         interface{} `json:"importDate"`
			ItemNumber         interface{} `json:"itemNumber"`
			Formname           interface{} `json:"formname"`
			BeginDate          interface{} `json:"beginDate"`
			DeviceType         string      `json:"deviceType"`
			InstrVersion       interface{} `json:"instrVersion"`
			Technical          interface{} `json:"technical"`
			Function           interface{} `json:"function"`
			Subject            interface{} `json:"subject"`
			ServiceContent     interface{} `json:"serviceContent"`
			Requirement        interface{} `json:"requirement"`
			Fee                interface{} `json:"fee"`
			ServiceUrl         interface{} `json:"serviceUrl"`
			Province           interface{} `json:"province"`
			City               interface{} `json:"city"`
			County             interface{} `json:"county"`
			Street             interface{} `json:"street"`
			TeacherContact     interface{} `json:"teacherContact"`
			TeacherNumber      interface{} `json:"teacherNumber"`
			Phone              interface{} `json:"phone"`
			Email              interface{} `json:"email"`
			Tprovince          interface{} `json:"tprovince"`
			Tcity              interface{} `json:"tcity"`
			Tcounty            interface{} `json:"tcounty"`
			Tstreet            interface{} `json:"tstreet"`
			Postalcode         interface{} `json:"postalcode"`
			Funds              interface{} `json:"funds"`
			InsideDepart       interface{} `json:"insideDepart"`
			InsideDepartCode   interface{} `json:"insideDepartCode"`
			DevState           interface{} `json:"devState"`
			LabcenterName      interface{} `json:"labcenterName"`
			LabcenterCode      interface{} `json:"labcenterCode"`
			LabName            interface{} `json:"labName"`
			LabCode            interface{} `json:"labCode"`
			Category           interface{} `json:"category"`
		} `json:"items"`
	} `json:"d"`
	M string `json:"m"`
}

func request() T {
	url := "http://huster.cn/api/user/AppointmentDevices"
	var result T
	c := req.C().SetProxyURL("http://127.0.0.1:8081")

	query := map[string]string{
		"type":      "1",
		"keyword":   "",
		"pageIndex": "2",
	}

	_, err := c.R().
		SetQueryParams(query).
		SetSuccessResult(&result).
		Get(url)
	if err != nil {
		fmt.Println("请求错误: " + err.Error())
	}

	return result
}

func matchTarget(t T) []string {
	var result []string
	for _, v := range t.D.Items {
		concatInfomation := strings.TrimSpace(v.ContactInformation)
		//fmt.Println(concatInfomation)
		if strings.Contains(concatInfomation, "/") {
			result = mySpilt(concatInfomation, "/", result)
		} else if strings.Contains(concatInfomation, "；") {
			result = mySpilt(concatInfomation, "；", result)
		} else {
			if !Find(result, concatInfomation) {
				result = append(result, concatInfomation)
			}
		}
	}
	return result
}

func Find(slice []string, val string) bool {
	for _, item := range slice {
		if item == val {
			return true
		}
	}
	return false
}

func mySpilt(concatInfomation, sep string, result []string) []string {
	split := strings.Split(concatInfomation, sep)
	s1 := strings.TrimSpace(split[0])
	s2 := strings.TrimSpace(split[1])
	if !Find(result, s1) {
		result = append(result, s1)
	}
	if !Find(result, s2) {
		result = append(result, s2)
	}
	return result
}

func main() {
	t := request()
	target := matchTarget(t)
	for _, v := range target {
		if !strings.Contains(v, "-") && !strings.Contains(v, "+") &&
			!strings.Contains(v, "qq") && !strings.Contains(v, "QQ") {
			fmt.Println(v)
		}
	}

}
