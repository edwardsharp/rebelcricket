
unless RebelPage.find_by name: 'home'
  RebelPage.create(
    name: 'home',
    data: JSON.parse('{"attachments":[{"name":"maxresdefault.jpg","url":"http://beta.rebelcricket.com/maxresdefault.jpg","caption":""},{"name":"funny-cats-sneezing-3.jpg","url":"http://beta.rebelcricket.com/funny-cats-sneezing-3.jpg","caption":""},{"name":"edfsaf.jpg","url":"http://beta.rebelcricket.com/edfsaf.jpg","caption":""},{"name":"200_s.gif","url":"http://beta.rebelcricket.com/200_s.gif","caption":""}]}')
  )
end

unless RebelPage.find_by name: 'about'
  RebelPage.create(
    name: 'about',
    data: JSON.parse('{"heading":"ABOUT REBEL CRICKET","items":[{"title":"Mission","description":"Respect. \nOur standard inks for textile production are water based or phthalate free plastisol. \nWood and paper prints are made with lead free water based acrylic inks. \nFor metal, glass and plastic we use lead free solvent inks \nClean up agents are soy or citrus based and biodegradable."},{"title":"Art Requirements","description":"Art Requirements \nWe love receiving graphics for custom work via email. Graphic files can be sent as ai, eps, pdf, psd, jpeg,or tiff. They should be sized to the desired print size at 300 dpi. If all you have is a physical copy of the art let us know,we’ll schedule a time for you to bring it in and discuss the options. \nHave questions? Give us a call 503-545-1450"}]}')
  )
end

unless RebelPage.find_by name: 'services'
  RebelPage.create(
    name: 'services',
    data: JSON.parse('{"heading":"SERVICES","items":[{"slug":"apparel","name":"Apparel","image":"apparel.jpg","detail_items":[{"name":"","description":"From the tried and true to the trendy and new, we can source your favorite brand or help you find a new one. We’ll discuss ink formulations that best match the garment and provide just the right feel and look for your brand."}],"detail_images":["apparel.jpg"]},{"slug":"parts-printing","name":"Parts Printing","image":"parts-printing.jpg","detail_items":[{"name":"","description":"Printing for parts and pieces of your end product. If you’re assembling and manufacturing your own products this is your category and we’d love to hear from you. In this arena every project is truly unique and though we invite your phone call for discussion, it is crucial for us to examine physical items and assess needed ink formulations and jigs prior to providing a true estimate. Design and fabrication of jigs may be required so additional lead time is appreciated. We stock ink formulations for plexi, metal, glass and a variety of flexible films which means you can have your logo printed on just about anything. Make an appointment today."}],"detail_images":["parts-printing.jpg"]},{"slug":"flatstock","name":"Flatstock","image":"flatstock.jpg","detail_items":[{"name":"","description":"Call us today for current pricing regarding stickers and posters. \n 503-545-1450"}],"detail_images":["flatstock.jpg"]},{"slug":"buttons","name":"Buttons","image":"buttons.jpg","detail_items":[{"name":"","description":"Rebel Cricket Screen Prints offers 4 sizes of pin back style buttons. 1\", 1.25\", 1.5\", and 2.25\" \nBlack and White or Full Color options available. Want a template for designing yours? We’ll have templates for download and current pricing listed soon. For now, email your request for the size you’d like and we’ll send template and pricing. Standard turnaround is 2 weeks or less."}],"detail_images":["buttons.jpg"]},{"slug":"vinyl-lettering","name":"Vinyl Lettering","image":"vinyl-lettering.jpg","detail_items":[{"name":"","description":"Need a new look for the windows of your store? Want fun seasonal decor that’s easy to update or your business logo on your vehicle? Rebel Cricket Screen Prints has you covered here too. \nOur vinyl cutting department stocks a range of products for indoor and outdoor signage. From easy to remove low tack vinyls for decorating your showroom walls to the \"ain’t going anywhere\" high tack varieties used for permanent displays."}],"detail_images":["vinyl-lettering.jpg"]},{"slug":"otherstuff","name":"Other Stuff","image":"otherstuff.jpg","detail_items":[{"name":"Sublimation","description":"We also offer full color sublimation printing onto 100%polyester garments, coffee mugs, water bottles and a variety of flat goods such as puzzles, plaques and awards."},{"name":"Large format screen printing","description":"up to 36\" x 60\" is available with use of waterbased and solvent inks. Great for indoor/outdoor promotional signs and fabrics off the bolt."},{"name":"Sandblasting","description":"From mirrors to ceramics and glassware we offer custom decoration through sandblasting. Display your logo on a range of items without the ink. Strange to hear from your printer, we know but we just love to put images on things. Rates vary and are specific to each project based on complexity of art and shape of piece to be etched."}],"detail_images":["otherstuff.jpg"]}]}')
  )
end

Dir.foreach("#{::Rails.root}/public/rebelimages/") do |image|
  next if image == '.' or image == '..' or RebelGfx.exists?(filename: image)
  RebelGfx.create(
    filename: image,
    url: "http://beta.rebelcricket.com/rebelimages/#{image}",
    path: "#{::Rails.root}/public/rebelimages/#{image}",
    rebel_quote_number: 'rebelimages'
  )
end

if ApiKey.count < 1
  ApiKey.create!
end