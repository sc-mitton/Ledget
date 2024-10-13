from django.urls import reverse

from restapi.tests.mixins import ViewTestsMixin


class TextInvestmentsViews(ViewTestsMixin):

    def test_list_investments(self):

        response = self.client.get(reverse('investments'))
        self.assertEqual(response.status_code, 200)
