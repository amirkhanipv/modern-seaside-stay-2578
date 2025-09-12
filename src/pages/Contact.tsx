import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "آدرس",
      details: [
        "تهران، خیابان ولیعصر",
        "پلاک ۱۲۳، طبقه دوم",
        "کد پستی: ۱۹۱۹۷"
      ]
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "تلفن تماس",
      details: ["۰۹۹۹ ۹۹۹ ۹۹۹۹", "۰۲۱ ۱۲۳۴ ۵۶۷۸"]
    },
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "ایمیل",
      details: ["info@norastudio.ir", "booking@norastudio.ir"]
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "ساعات کاری",
      details: [
        "شنبه تا پنج‌شنبه: ۹ تا ۱۸",
        "جمعه: تعطیل"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-b from-muted/30 to-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                تماس با ما
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                برای رزرو نوبت یا اطلاعات بیشتر با ما در ارتباط باشید
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="animate-fade-in">
                <Card className="shadow-lg border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground">
                      فرم تماس
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      پیام خود را برای ما ارسال کنید
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          پیام ارسال شد!
                        </h3>
                        <p className="text-muted-foreground">
                          پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-foreground">
                              نام و نام خانوادگی
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="bg-input border-border focus:border-primary"
                              placeholder="نام خود را وارد کنید"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-foreground">
                              {t.contact.form.phone}
                            </Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="bg-input border-border focus:border-primary"
                              placeholder={t.contact.form.placeholders.phone}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-foreground">
                            {t.contact.form.email}
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="bg-input border-border focus:border-primary"
                            placeholder={t.contact.form.placeholders.email}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-foreground">
                            {t.contact.form.subject}
                          </Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className="bg-input border-border focus:border-primary"
                            placeholder={t.contact.form.placeholders.subject}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-foreground">
                            {t.contact.form.message}
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={5}
                            className="bg-input border-border focus:border-primary resize-none"
                            placeholder={t.contact.form.placeholders.message}
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                              {t.contact.form.sending}
                            </div>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              {t.contact.form.send}
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-8 animate-fade-in [animation-delay:200ms]">
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-foreground">
                    اطلاعات تماس
                  </h2>
                  <div className="grid gap-6">
                    {contactInfo.map((info, index) => (
                      <Card key={index} className="p-6 hover:shadow-md transition-shadow border-border bg-card">
                        <div className="flex items-start space-x-4 rtl:space-x-reverse">
                          <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                            {info.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-2">
                              {info.title}
                            </h3>
                            {info.details.map((detail, detailIndex) => (
                              <p key={detailIndex} className="text-muted-foreground">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Map Placeholder */}
                <Card className="overflow-hidden border-border bg-card">
                  <div className="h-64 bg-muted/50 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        نقشه محل استودیو
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/20">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                {t.contact.faq.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t.contact.faq.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {t.contact.faq.items.map((faq, index) => (
                <Card key={index} className="p-6 animate-fade-in border-border bg-card" style={{ animationDelay: `${index * 100}ms` }}>
                  <h3 className="font-semibold text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}