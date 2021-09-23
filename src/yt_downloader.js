const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async function ytDownloader(url, videoQuality, videoFormat) {
  const youtube = {};
  const qualityCheck = ['144', '240', '360', '480', '720', '1080'];
  let quality;

  // Regex untuk memvalidasi url
  const regexUrl = /^((https?:\/\/)?(www.)?(youtu(be)?.(be|com))\/(watch\?v=)?)/;

  // Regex untuk mengambil nilai dari k__id
  const regexUniqId = /(?<=k__id.?=.?("|'))\w+/;

  // Regex untuk mengambil download url dari video
  const regexDownloadUrl = /(?<=<a href=")[\w:\/\/\.\?\=]+/;

  // Cek apakah url sudah benar
  if (!regexUrl.test(url)) throw new Error('Invalid URL');
  const videoId = url.replace(regexUrl, '').trim();
  try {
    const response = await axios({
      method: 'post',
      url: 'https://www.y2mate.com/mates/analyze/ajax',
      data: `url=https://www.youtube.com/watch?v=${videoId}&q_auto=1&ajax=1`,
    }).then((response) => response.data);

    const $ = cheerio.load(response.result);

    // Menentukan kualitas video
    if (qualityCheck.includes(videoQuality)) {
      quality = $(`td:contains("${videoQuality}p (.${videoFormat})")`)
        .next()
        .next()
        .find('a')
        .attr('data-fquality');
    } else {
      throw new Error(`Kualitas video tidak valid`);
    }

    // Ambil title dari video
    youtube.title = $('.caption.text-left b').text().trim();

    // Ambil thumbnail dari video
    youtube.thumb = $('.thumbnail.cover img').attr('src');

    // Ambil size dari video
    youtube.size = $(`td:contains("${videoQuality}p (.${videoFormat})")`)
      .next()
      .text()
      .trim();
    if (youtube.size === 'MB') youtube.size = '-';

    // Cek apakah ada k__id atau tidak
    if (!regexUniqId.test(response.result))
      throw new Error('Tidak dapat mendownload video');
    const uniqId = regexUniqId.exec(response.result)[0];
    const result = await axios({
      method: 'post',
      url: 'https://www.y2mate.com/mates/convert',
      data: `type=youtube&_id=${uniqId}&v_id=${videoId}&ajax=1&token=&ftype=${videoFormat}${(videoFormat === 'mp3') ? '' : `&fquality=${quality}`}`,
    }).then((response) => response.data);

    // Ambil download video url
    youtube.download_url = regexDownloadUrl.exec(result.result)[0];

    return youtube;
  } catch (error) {
    if (error.message === "Cannot read property '0' of null") {
      throw new Error(`Kualitas yang diminta tidak tersedia`);
    } else {
      throw new Error(`${error}`);
    }
  }
};
