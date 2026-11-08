"use client";

import PageHero from "@/components/ui/page-hero";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function TermsPage() {
  return (
    <main className="container max-w-5xl mx-auto pb-12 pt-8 px-4">
      <PageHero
        badge="Legal"
        title={<>Terms &amp; <span className="text-primary">Privacy</span> Policy</>}
        description={
          <>
            The terms of use and privacy policy of the Code Club at FST Settat.
            <span lang="ar" dir="rtl" className="mt-1 block">
              سياسة الخصوصية
            </span>
          </>
        }
        className="pt-0 md:pt-4"
      />

      <Tabs defaultValue="ar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ar">🇲🇦 العربية</TabsTrigger>
          <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
        </TabsList>

        {/* النسخة العربية */}
        <TabsContent value="ar" className="mt-6 text-right" dir="rtl">
          <div className="space-y-6">
          
            <h2 className="font-semibold text-lg">مقدمة</h2>
            <p>
              مرحبًا بك في <strong>Code Club</strong>. باستخدامك لهذا الموقع، فإنك توافق على جمع ومعالجة بياناتك الشخصية وفقًا لهذه السياسة. نحن نأخذ حماية بياناتك الشخصية على محمل الجد، وتشرح هذه السياسة نوع البيانات التي نجمعها، أسباب جمعها، كيفية حمايتها، وحقوقك بموجب القانون المغربي رقم 09.08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي.
            </p>

            <h2 className="font-semibold text-lg">1. البيانات التي نجمعها</h2>
            <ul className="list-disc pr-6 space-y-1">
              <li>الاسم الكامل</li>
              <li>عنوان البريد الإلكتروني</li>
              <li>رقم الهاتف</li>
              <li>تذاكر الفعاليات: الاسم، وقت الدخول واسم من قام بالمسح</li>
              <li>المستوى الدراسي/الأكاديمي</li>
              <li>حضور الأنشطة (اختياري)</li>
              <li>تاريخ الانضمام/التسجيل</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              ملاحظة: لا نجمع البيانات الحساسة (الصحة، الدين، الآراء السياسية، إلخ) إلا عند الضرورة وبموافقتك الصريحة.
            </p>

            <h2 className="font-semibold text-lg">2. أغراض المعالجة</h2>
            <ul className="list-disc pr-6 space-y-1">
              <li>إدارة حسابك وعضويتك على الموقع</li>
              <li>التواصل حول الفعاليات والأنشطة</li>
              <li>إعداد إحصائيات لتحسين خدماتنا</li>
              <li>تنظيم وإدارة الأنشطة والفعاليات</li>
            </ul>

            <h2 className="font-semibold text-lg">3. حقوقك</h2>
            <ul className="list-disc pr-6 space-y-1">
              <li>الوصول إلى بياناتك الشخصية</li>
              <li>طلب التصحيح أو التحديث</li>
              <li>طلب الحذف الدائم (الحق في النسيان)</li>
              <li>الاعتراض على أنشطة معالجة معينة</li>
              <li>سحب موافقتك في أي وقت</li>
              <li>الحصول على نسخة من بياناتك بتنسيق قابل للقراءة</li>
            </ul>
            <p>لممارسة حقوقك، تواصل معنا على: [البريد الإلكتروني]</p>

            <h2 className="font-semibold text-lg">4. حماية البيانات</h2>
            <ul className="list-disc pr-6 space-y-1">
              <li>استخدام HTTPS للاتصالات الآمنة</li>
              <li>تشفير كلمات المرور (bcrypt)</li>
              <li>تقييد الوصول للموظفين المخولين فقط</li>
              <li>النسخ الاحتياطية الآمنة</li>
              <li>مراقبة منتظمة لأنظمة الأمان</li>
            </ul>

            <h2 className="font-semibold text-lg">5. الاحتفاظ بالبيانات</h2>
            <ul className="list-disc pr-6 space-y-1">
              <li>طوال فترة استخدامك النشط للموقع</li>
              <li>لمدة سنتين بعد آخر تواصل أو حتى تطلب الحذف</li>
              <li>سيتم حذف البيانات نهائيًا بعد انتهاء هذه المدة</li>
            </ul>

            <h2 className="font-semibold text-lg">6. مشاركة البيانات</h2>
            <p>لن نشارك بياناتك مع أي طرف ثالث بدون موافقتك الصريحة، إلا في الحالات التالية:</p>
            <ul className="list-disc pr-6 space-y-1">
              <li>عند الضرورة القانونية</li>
              <li>لحماية حقوقنا أو حقوق الآخرين</li>
              <li>في حالات الطوارئ لضمان السلامة</li>
            </ul>

            <h2 className="font-semibold text-lg">7. ملفات تعريف الارتباط (Cookies)</h2>
            <ul className="list-disc pr-6 space-y-1">
              <li>عمل الموقع بشكل صحيح</li>
              <li>حفظ تفضيلات المستخدم الأساسية</li>
              <li>تحسين الأداء</li>
            </ul>

            <h2 className="font-semibold text-lg">8. التغييرات على السياسة</h2>
            <p>قد نقوم بتحديث هذه السياسة من وقت لآخر. سيتم إعلامك بأي تغييرات مهمة عبر:</p>
            <ul className="list-disc pr-6 space-y-1">
              <li>الموقع الإلكتروني</li>
              <li>البريد الإلكتروني المسجل</li>
              <li>الإشعارات داخل الموقع</li>
            </ul>

            <h2 className="font-semibold text-lg">9. الموافقة</h2>
            <p>
              باستخدام هذا الموقع أو التسجيل فيه، فإنك توافق صراحةً على سياسة الخصوصية هذه وجمع ومعالجة بياناتك الشخصية وفقًا لأغراضها المحددة. يمكنك سحب موافقتك في أي وقت من خلال التواصل معنا.
            </p>

            {/*<h2 className="font-semibold text-lg">10. التواصل معنا</h2>
            <ul className="list-disc pr-6 space-y-1">
              <li>البريد الإلكتروني: club.code.fsts@gmail.com</li>
              <li>الهاتف: 0774206014</li>
              <li>العنوان البريدي: Settat, Morocco</li>
            </ul>*/}
          </div>
        </TabsContent>

        {/* English version */}
        <TabsContent value="en" className="mt-6 text-left">
          <div className="space-y-6">

            <h2 className="font-semibold text-lg">Introduction</h2>
            <p>
              Welcome to <strong>Code Club</strong>. By using this website, you agree to the collection and processing of your personal data as described in this policy. We take your personal data protection seriously. This policy explains the types of data we collect, why we collect it, how we protect it, and your rights under Moroccan Law 09.08.
            </p>

            <h2 className="font-semibold text-lg">1. Data We Collect</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Event tickets: your name, and when and by whom the ticket was scanned at the entrance</li>
              <li>Academic level</li>
              <li>Activity attendance (optional)</li>
              <li>Membership/registration date</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Note: Sensitive data (health, religion, political views, etc.) is only collected when necessary and with explicit consent.
            </p>

            <h2 className="font-semibold text-lg">2. Purposes of Processing</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Managing your account and membership</li>
              <li>Communicating about events and activities</li>
              <li>Internal statistics to improve our services</li>
              <li>Organizing and managing activities and events</li>
            </ul>

            <h2 className="font-semibold text-lg">3. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access your personal data</li>
              <li>Request correction or update</li>
              <li>Request permanent deletion (right to be forgotten)</li>
              <li>Object to certain processing activities</li>
              <li>Withdraw your consent at any time</li>
              <li>Obtain a copy of your data in a readable format</li>
            </ul>
            <p>To exercise your rights, contact us at: club.code.fsts@gmail.com</p>

            <h2 className="font-semibold text-lg">4. Data Protection</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use of HTTPS for secure connections</li>
              <li>Password encryption (bcrypt)</li>
              <li>Restricted access to authorized personnel only</li>
              <li>Secure backups</li>
              <li>Regular security monitoring</li>
            </ul>

            <h2 className="font-semibold text-lg">5. Data Retention</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>During your active use of the website</li>
              <li>No longer than two years after last contact or until you request deletion</li>
              <li>Data will be permanently deleted after this period</li>
            </ul>

            <h2 className="font-semibold text-lg">6. Data Sharing</h2>
            <p>Your data will not be shared with third parties without your explicit consent, except:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Where required by law</li>
              <li>To protect our rights or the rights of others</li>
              <li>In emergency situations to protect safety</li>
            </ul>

            <h2 className="font-semibold text-lg">7. Cookies</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Ensure proper website functionality</li>
              <li>Save basic user preferences</li>
              <li>Improve performance</li>
            </ul>

            <h2 className="font-semibold text-lg">8. Policy Changes</h2>
            <p>We may update this policy from time to time. Significant changes will be communicated via:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Our website</li>
              <li>Registered email</li>
              <li>In-app notifications</li>
            </ul>

            <h2 className="font-semibold text-lg">9. Consent</h2>
            <p>
              By using or registering on this website, you explicitly agree to this privacy policy and the collection and processing of your personal data for the specified purposes. You may withdraw your consent at any time by contacting us.
            </p>

            {/*<h2 className="font-semibold text-lg">10. Contact Us</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Email: club.code.fsts@gmail.com</li>
              <li>Phone: +212 774206014</li>
              <li>Address: Settat, Morocco</li>
            </ul>*/}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}