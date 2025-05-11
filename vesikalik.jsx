// Vesikalık Fotoğraf Oluşturucu Script
// Photoshop'ta çalıştırmak için: File > Scripts > Browse

function createVesikalik() {
    try {
        // Ayarlar
        var vesikalikGenislik = 3.5; // cm
        var vesikalikYukseklik = 4.5; // cm
        var kenarBosluk = 0.5; // cm
        var sayfaGenislik = vesikalikGenislik * 2 + kenarBosluk * 3; // 2 fotoğraf + 3 boşluk
        var sayfaYukseklik = vesikalikYukseklik * 2 + kenarBosluk * 3; // 2 fotoğraf + 3 boşluk
        var dpi = 300;
        
        // Birim dönüşümü için yardımcı fonksiyon
        function cmToPx(cm) {
            return Math.round(cm * dpi / 2.54);
        }

        // Kullanıcıdan fotoğraf seçmesini iste
        var dosya = File.openDialog("Lütfen vesikalık için fotoğraf seçin", "*.jpg;*.jpeg;*.png;*.tif;*.psd", false);
        if (dosya == null) {
            alert("Dosya seçilmedi!");
            return;
        }

        // Orijinal fotoğrafı aç
        var orijinalDokuman = app.open(dosya);
        
        // Yeni belge oluştur (beyaz arka plan)
        var yeniDokuman = app.documents.add(
            cmToPx(sayfaGenislik), 
            cmToPx(sayfaYukseklik), 
            dpi, 
            "Vesikalık 4lü", 
            NewDocumentMode.RGB, 
            DocumentFill.WHITE
        );

        // Orijinal fotoğrafı seç ve kopyala
        app.activeDocument = orijinalDokuman;
        orijinalDokuman.selection.selectAll();
        orijinalDokuman.selection.copy();
        orijinalDokuman.close(SaveOptions.DONOTSAVECHANGES);
        
        // Sayfa merkezini hesapla
        var sayfaMerkezX = cmToPx(sayfaGenislik) / 2;
        var sayfaMerkezY = cmToPx(sayfaYukseklik) / 2;
        
        // Vesikalık konumları (piksel cinsinden) - sayfayı dört eşit parçaya böl
        var positions = [
            // Sol üst
            {
                x: sayfaMerkezX / 2,
                y: sayfaMerkezY / 2
            },
            // Sağ üst
            {
                x: sayfaMerkezX + sayfaMerkezX / 2,
                y: sayfaMerkezY / 2
            },
            // Sol alt
            {
                x: sayfaMerkezX / 2,
                y: sayfaMerkezY + sayfaMerkezY / 2
            },
            // Sağ alt
            {
                x: sayfaMerkezX + sayfaMerkezX / 2,
                y: sayfaMerkezY + sayfaMerkezY / 2
            }
        ];
        
        // Her pozisyon için fotoğrafı yapıştır ve konumlandır
        for (var i = 0; i < positions.length; i++) {
            // Yeni belgeye yapıştır
            app.activeDocument = yeniDokuman;
            yeniDokuman.paste();
            
            // Katmanı boyutlandır
            var katman = yeniDokuman.activeLayer;
            
            // Katmanın mevcut boyutlarını al
            var bounds = katman.bounds;
            var katmanGenislik = bounds[2] - bounds[0];
            var katmanYukseklik = bounds[3] - bounds[1];
            
            // Vesikalık boyutlarını piksel cinsinden hesapla
            var vesikalikGenislikPx = cmToPx(vesikalikGenislik);
            var vesikalikYukseklikPx = cmToPx(vesikalikYukseklik);
            
            // Oranları hesapla
            var genislikOrani = vesikalikGenislikPx / katmanGenislik;
            var yukseklikOrani = vesikalikYukseklikPx / katmanYukseklik;
            
            // En küçük oranı kullan (fotoğrafın oranını korumak için)
            var olceklemeOrani = Math.min(genislikOrani, yukseklikOrani) * 100;
            
            // Katmanı ölçekle
            katman.resize(olceklemeOrani, olceklemeOrani, AnchorPosition.MIDDLECENTER);
            
            // Katmanın yeni konumunu al
            bounds = katman.bounds;
            var katmanX = (bounds[0] + bounds[2]) / 2;
            var katmanY = (bounds[1] + bounds[3]) / 2;
            
            // Katmanı konumlandır
            katman.translate(positions[i].x - katmanX, positions[i].y - katmanY);
            
            // Katmanı yeniden adlandır
            katman.name = "Vesikalık " + (i + 1);
        }
        
        // Belgeyi aktif et
        app.activeDocument = yeniDokuman;
        
        alert("4'lü vesikalık fotoğraf oluşturuldu!");
    } catch (e) {
        alert("Hata oluştu: " + e);
    }
}

// Ana fonksiyonu çalıştır
createVesikalik();


