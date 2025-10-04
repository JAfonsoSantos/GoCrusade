-- Add INSERT, UPDATE, DELETE policies for business-scoped tables

-- Property policies
CREATE POLICY "Users can insert properties in their business"
  ON public.property FOR INSERT
  WITH CHECK (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can update properties in their business"
  ON public.property FOR UPDATE
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can delete properties in their business"
  ON public.property FOR DELETE
  USING (business_id = public.get_user_business_id(auth.uid()));

-- Ad Unit policies
CREATE POLICY "Users can insert ad units in their business"
  ON public.ad_unit FOR INSERT
  WITH CHECK (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can update ad units in their business"
  ON public.ad_unit FOR UPDATE
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can delete ad units in their business"
  ON public.ad_unit FOR DELETE
  USING (business_id = public.get_user_business_id(auth.uid()));

-- Advertiser policies
CREATE POLICY "Users can insert advertisers in their business"
  ON public.advertiser FOR INSERT
  WITH CHECK (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can update advertisers in their business"
  ON public.advertiser FOR UPDATE
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can delete advertisers in their business"
  ON public.advertiser FOR DELETE
  USING (business_id = public.get_user_business_id(auth.uid()));

-- Brand policies
CREATE POLICY "Users can insert brands in their business"
  ON public.brand FOR INSERT
  WITH CHECK (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can update brands in their business"
  ON public.brand FOR UPDATE
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can delete brands in their business"
  ON public.brand FOR DELETE
  USING (business_id = public.get_user_business_id(auth.uid()));

-- Contact policies
CREATE POLICY "Users can insert contacts in their business"
  ON public.contact FOR INSERT
  WITH CHECK (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can update contacts in their business"
  ON public.contact FOR UPDATE
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can delete contacts in their business"
  ON public.contact FOR DELETE
  USING (business_id = public.get_user_business_id(auth.uid()));

-- Opportunity policies
CREATE POLICY "Users can insert opportunities in their business"
  ON public.opportunity FOR INSERT
  WITH CHECK (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can update opportunities in their business"
  ON public.opportunity FOR UPDATE
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can delete opportunities in their business"
  ON public.opportunity FOR DELETE
  USING (business_id = public.get_user_business_id(auth.uid()));

-- Campaign policies
CREATE POLICY "Users can insert campaigns in their business"
  ON public.campaign FOR INSERT
  WITH CHECK (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can update campaigns in their business"
  ON public.campaign FOR UPDATE
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can delete campaigns in their business"
  ON public.campaign FOR DELETE
  USING (business_id = public.get_user_business_id(auth.uid()));

-- Flight policies
CREATE POLICY "Users can insert flights for their campaigns"
  ON public.flight FOR INSERT
  WITH CHECK (
    campaign_id IN (
      SELECT id FROM public.campaign WHERE business_id = public.get_user_business_id(auth.uid())
    )
  );

CREATE POLICY "Users can update flights for their campaigns"
  ON public.flight FOR UPDATE
  USING (
    campaign_id IN (
      SELECT id FROM public.campaign WHERE business_id = public.get_user_business_id(auth.uid())
    )
  );

CREATE POLICY "Users can delete flights for their campaigns"
  ON public.flight FOR DELETE
  USING (
    campaign_id IN (
      SELECT id FROM public.campaign WHERE business_id = public.get_user_business_id(auth.uid())
    )
  );

-- Creative policies
CREATE POLICY "Users can insert creatives for their campaigns"
  ON public.creative FOR INSERT
  WITH CHECK (
    campaign_id IN (
      SELECT id FROM public.campaign WHERE business_id = public.get_user_business_id(auth.uid())
    )
  );

CREATE POLICY "Users can update creatives for their campaigns"
  ON public.creative FOR UPDATE
  USING (
    campaign_id IN (
      SELECT id FROM public.campaign WHERE business_id = public.get_user_business_id(auth.uid())
    )
  );

CREATE POLICY "Users can delete creatives for their campaigns"
  ON public.creative FOR DELETE
  USING (
    campaign_id IN (
      SELECT id FROM public.campaign WHERE business_id = public.get_user_business_id(auth.uid())
    )
  );