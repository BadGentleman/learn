var http = require("http");
var cheerio = require("cheerio");
var fs = require('fs');
var async = require('async');
var iconv = require('iconv-lite');
/*
 * 爬虫函数
 * @param url {String} 目标网页url
 * @param parse {Function} 解析函数
 * @param encode {String} 页面编码, 默认utf-8
 */
function crawl(url, parse, encode){
	//var encodeList = ['utf-8', 'gb2312', 'gbk'];支持的编码格式,其他字符串替换uft8或者报错
	encode = (encode === undefined) /*encodeList.indexOf(encode) === -1*/? 'utf-8' : encode; 
	http.get(url, function(res){
		var buf = [],
			size = 0,
			html = '';

		res.on('data', function(chunk){
			size += chunk.length;
			buf.push(chunk);
		});

		res.on('end', function(){
			//iconv对网页编码
			html = iconv.decode(Buffer.concat(buf, size), encode);
			parse(html);
		});
	});
}
/*
 * 科室解析函数
 * @param html {String} 被解析网页源码
 */	
 function parseOffice(html){
 	//用cheerio对网页进行加载
 	var $ = cheerio.load(html);

 	var container = [];//存储所有种类的科室
 	// var office = {
 	// 	type: '',
 	// 	name: '',
 	// 	src: ''
 	// }

 	var types = $('.blueg');
 	var allOffice = $('.m_ctt_green');
 	var typesLen = types.length;
 	var index = 0;
 	types.each(function(item){

 		var type = $(this).text();
 		var officeArray = [];

 		var links = allOffice.eq(index++).find('.black_link');
 		links.each(function(item){
 			var link = $(this);
 			var office = {
 				name: link.text(),
 				href: link.attr('href')
 			}

 			officeArray.push(office);
 		});

 		var officeType = {//每种科室包含自己的名字和具体科室
 			name: type,
 			offices: officeArray
 		}

 		container.push(officeType);
 	});

 	var content = '';
 	var len = 0;
 	container.forEach(function(value, index){
 		var tmpTxt = '科室种类:' + value.name + '\r\n\r\n' + '具体科室:';

 		value.offices.forEach(function(value, index){
 			tmpTxt += value.name + '   ';
 		});

 		len += value.offices.length;

 		content += tmpTxt + '\r\n\r\n\r\n\r\n\r\n\r\n';
 	});

 	fs.writeFile('./res/科室.txt', content, function(err){
 		if(err){
			return console.error(err);
		}
		console.log('写入科室成功');		
 	});

 	//爬内科科室的所有大夫信息
 	container.forEach(function(value, index){
 		value.offices.forEach(function(value, index){
 			crawl(baseUrl + value.href, parseDoctor, 'gb2312');
 		});
 	});
 }
 

 function parseDoctor(html){
 	var $ = cheerio.load(html);

 	var fileName = $('.navbar_focus_middle').text().split(' ')[0];

 	var doctorsArray = [];

 	var allInfo = $('.good_doctor_list_td');

 	var origin = 0;
 	allInfo.each(function(item){
 		var info = $(this);
 		var index = (origin / 4) >> 0;
 		var doctor = doctorsArray[index];

 		if(doctor === undefined){
 			doctor = {};
 			doctorsArray.push(doctor);
 		}

 		switch(origin++ % 4){
 			case 0:  
 				var tr = info.find('tr');
	 			var name = tr.find('.blue').text();
	 			var job = tr.eq(1).find('td').eq(1).text();
	 			var degree = tr.eq(2).find('td').eq(1).text();
	 			doctor.name = name;
	 			doctor.job = job;
	 			doctor.degree = degree;
	 			break;
	 		case 1:  
	 			var a = info.find('a').text().trim();
	 			var con = a.split('\n\t\t\t\t\t\t\t\t\t\t');
	 			var hospital = con[0];
	 			var office = con[1];
	 			doctor.hospital = hospital;
	 			doctor.office = office;
	 			break;
	 		case 2:  
	 			var heat = info.find('i').text().trim();
	 			doctor.heat = heat;
	 			break;
	 		case 3:  
	 			break;
	 		default: 
	 			console.log('失败');
	 			break;
 		}		
 	});
 	
 	var content = ' 姓名    职称(医生)    职称(教师)    医院    科室    热度\r\n\r\n';
 	doctorsArray.forEach(function(value, index){
 		if(value.degree === ''){
 			value.degree = '无';
 		}
 		var tmpTxt = value.name 
 				+ ',' + value.job 
 				+ ',' + value.degree
 				+ ',' + value.hospital
 				+ ',' + value.office
 				+ ',' + value.heat
 				+ '\r\n\r\n'; 
 		content += tmpTxt;
 	});

 	fs.writeFile('./res/' + fileName + '.txt', content, function(err){
 		if(err){
 			return console.error(err);
 		}
 		console.log('写入' + fileName + '成功');
 	});

 	/*
 	 * 所有信息全部存储在一个文件里
 	 * 解析完一个连接后把信息存入全局数组中
 	 * 添加事件监听，一旦finalInfo全局数组的数组总数与科室总书相同(一个数组即一个科室连接的解析结果)
 	 * 就可以对二维数组进行双重遍历，解析信息并写入一个文件中
 	 * (在文件尾继续写入数据不会,但是感觉控制不了异步函数的执行顺序, 无法保证信息的完整性)
 	 * ps: 事件监听类忘了......所以暂时就不改写了
 	 * ps: 如果这时候会Mongo就好了.....
 	 */
 	//finalInfo.push(doctorsArray);
 }
//var finalInfo = [];

var baseUrl = 'http://www.haodf.com';
crawl('http://www.haodf.com/keshi/list.htm', parseOffice, 'gb2312');