// {
// 	title: h1 a,
// 	link:  h1 a(href),
// 	price: .the_price ol strong span,
// 	area:  .the_area ol strong span,
// 	adress:.house_info,
// 	hot:   .house_hot
// }
const superagent=require("superagent");
const cheerio=require("cheerio");
const fs=require("fs");

async function getData(i){
	let html=await getHtml(i);
	let data=handleHtml(html);
	let datas=createWriteData(data);
	writeFiles(datas);
	i++;
	if(i<63){
		getData(i);
	}
}

getData(1);

function getHtml(i){
	let url="http://fz.maitian.cn/esfall/SB0SE250/H3T6J2/PG"+i+"/DT1";
	return superagent.get(url).then((res)=>{
		return res.text;
	})
}

function handleHtml(html){
	const $=cheerio.load(html);
	let rs=[];
	$(".list_wrap ul li").each((i,el)=>{
		el=$(el);
		let item={};
		item.title=el.find("h1 a").text().replace(/[,]/g,"，");
		item.link="http://fz.maitian.cn/"+el.find("h1 a").attr("href");
		item.price=el.find(".the_price ol strong span").text();
		item.area=el.find(".the_area ol strong span").text();
		item.district=/\[(.+)\]/.exec(el.find(".house_info").text())[1];
		item.adress=el.find(".house_info").text().replace(/[,]/g,"，");
		item.hot=el.find(".house_hot").text().replace(/\s+/g,"").replace(/[,]/g,"，");
		rs.push(item);
	});
	return rs;
}
function createWriteData(rs){
	let writeDatas="";
	for(let i=0;i<rs.length;i++){
		let data=rs[i];
		for(let key in data){
			writeDatas+=data[key]+",";
		}
		writeDatas+="\n";
	}
	return writeDatas;
}

function writeFiles(data){
	fs.appendFile("./data.txt",data,'utf8',(err)=>{
		if(err) throw err;
	});
}
